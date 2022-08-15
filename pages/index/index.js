// index.js
const dayjs = require('dayjs');
import { baseUrl } from '../../config/api';
import { getStatus } from '../../utils/check';

Page({
  data: {
    // 日历信息
    thisYear: '', // 当前选择年份
    thisMonth: '', // 当前选择月份
    thisDay: '', // 当前选择日期
    popCanShow: false,// 是否展示选择日期弹框
    currentDate: '', // 当前选择的时间戳
    minSelectDate: dayjs('2022-01-01').valueOf(), // 最早可查询时间
    dateType: 'month', // 日期展示格式 month||day
    calendar: {
      days: '31', // 本月多少天
      week: '1', // 本月第一天为周几 日0一1二2三3四4五5六6
      daysArr: [] // 详细的日期数组
    },
    // 用户信息
    userInfo: {},
    // 活动信息
    taskData: [], // 活动数组
    silenceTask: [], // 活动失效
    beforeTask: [], // 活动未启动
    runningTask: [], // 活动进行中
  },

  // 初始化 用户信息 & 时间信息
  onLoad: function (options) {
    // 获取用户信息 以及 当前时间信息
    console.log('userInfo', getApp().globalData.userInfo);
    if (getApp().globalData.userInfo && getApp().globalData.userInfo != '') {
      this.setData({
        userInfo: getApp().globalData.userInfo,
      });
    } else {
      // 声明回调函数获取app.js onLaunch中接口调用成功后设置的globalData数据
      getApp().userInfoCallback = userInfo => {
        console.log('回调userInfoCallback');
        if (userInfo != '') {
          this.setData({
            userInfo: getApp().globalData.userInfo,
          });
          this.getTask(getApp().globalData.userInfo && getApp().globalData.userInfo.openid || '');
        }
      }
    }
    // 获取当前时间信息
    this.setData({
      // userInfo: getApp().globalData.userInfo,
      thisYear: dayjs().format('YYYY'),
      thisMonth: dayjs().format('M'),
      thisDay: dayjs().format('D'),
      currentDate: dayjs().valueOf(),
    });
    this.getDateData(dayjs().format('YYYY-MM-DD'));
  },

  // 获取活动信息
  onShow: function () {
    // this.onLoad();
    this.getTask(getApp().globalData.userInfo && getApp().globalData.userInfo.openid || '');
  },

  // 活动与日期相关联
  bundledTaskTime () {
    console.log('活动信息', this.data.runningTask, '时间信息', this.data.calendar.daysArr);
    let dateArr = this.data.calendar.daysArr; // 日历信息
    let taskArr = this.data.runningTask; // 活动信息
    const thisYear = this.data.thisYear; // 当前选择的年
    const thisMonth = this.data.thisMonth; // 当前选择的月
    dateArr.map((date)=>{
      if (date.date) {
        date.taskList = [];
      }
    })
    taskArr.map((task)=>{
      // console.log('这个活动是', task);
      if (!task.userId) return 
      if(task.dateType == 'range'){
        // 区间日期
        if(dayjs(task.endTime).isBefore(`${thisYear}-${thisMonth}`)) {
          // console.log('这个活动已经结束')
        } else if(dayjs(task.beginTime).isAfter(dayjs(`${thisYear}-${thisMonth}`).endOf('month'))) {
          // console.log('这个活动尚未开始')
        } else {
          dateArr.map((date)=>{
            // console.log('这个活动在进行中', date.date, date.taskList)
            if (date.date) {
              const thisDate = dayjs(`${thisYear}-${thisMonth}-${date.date}`).format('YYYY-MM-DD')
              if(!dayjs(thisDate).isBefore(task.beginTime) && !dayjs(thisDate).isAfter(task.endTime)) {
                date.taskList.push(task)
              }
            }
          })
        }
      } else if (task.dateType == 'multiple') {
        // 多个日期
        dateArr.map((date)=>{
          // console.log('这个活动在进行中', date.date, date.taskList)
          if (date.date) {
            const thisDate = dayjs(`${thisYear}-${thisMonth}-${date.date}`).format('YYYY-MM-DD')
            if(task.dateArr.includes(thisDate)) {
              date.taskList.push(task)
            }
          }
        })
      } else {
        // 单个日期
        dateArr.map((date)=>{
          // console.log('这个活动在进行中', date.date, date.taskList)
          if (date.date) {
            const thisDate = dayjs(`${thisYear}-${thisMonth}-${date.date}`).format('YYYY-MM-DD')
            if(task.beginTime == thisDate) {
              date.taskList.push(task)
            }
          }
        })
      }
    })
    // console.log('绑定后的dateArr', dateArr);
    this.setData({
      ['calendar.daysArr']: dateArr,
    });
  },

  // 获取活动状态
  getTaskStatus: function (data) {
    let runningTask = []; // 正在进行中的任务
    let beforeTask = []; // 未开始的任务
    let silenceTask = []; // 未进行的任务
    data.map((task)=>{
      if (task.status == 'stop') {
        silenceTask.push(task);
      } else {
        task.status = getStatus(task);
        console.log('task.status', task.status);
        if(task.status === 'after') {
          silenceTask.push(task);
        } else if(task.status === 'before') {
          beforeTask.push(task);
        } else {
          runningTask.push(task);
        }
      }
    })
    // runningTask = [...runningTask, ...beforeTask];
    console.log('进行中活动', runningTask, '未开始活动', beforeTask, '已完成活动', silenceTask);
    this.setData({
      taskData: data,
      silenceTask: silenceTask,
      beforeTask: beforeTask,
      runningTask: runningTask,
    });
    this.bundledTaskTime();
  },

  // userId 查找Task
  getTask (id) {
    var self = this;
    wx.request({
      url: `${baseUrl}/wxTask/findByUserId`,
      data: {
        userId: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success(data){
        if(data.data.code == 200) {
          const userTaskData = data.data.data;
          console.log('查询活动信息', userTaskData);
          const usefulTaskData = [];
          userTaskData.map((task)=>{
            if (task.status !== 'delect') {
              usefulTaskData.push(task);
            }
          });
          // 获取任务信息
          self.getTaskStatus(usefulTaskData);
        } else {
          // 查询不到用户信息/新增用户
          console.log('查询不到用户信息', data);
        }
      },
      file: res => {
        // 未查询到用户信息/弹toast/显示未登陆
      }
    })
  },

  // 展示修改日期弹框
  showPop: function () {
    console.log('修改时间');
    this.setData({ popCanShow: true });
  },

  // 关闭修改日期弹框
  closePop: function () {
    console.log('修改时间');
    this.setData({ popCanShow: false });
  },

  // 修改日期
  changeDate(event) {
    this.setData({
      thisYear: dayjs(event.detail).format('YYYY'),
      thisMonth: dayjs(event.detail).format('M'),
      thisDay: dayjs(event.detail).format('D'),
      currentDate: event.detail,
      popCanShow: false
    });
    console.log('修改后的日期为：', dayjs(event.detail).format('YYYY-MM-DD'))
    this.getDateData(dayjs(event.detail).format('YYYY-MM-DD'))
    this.bundledTaskTime();
  },

  // 修改展示类型
  changeType(e) {
    console.log('changeType', e);
    this.setData({
      dateType: e.currentTarget.dataset['datetype']
    });
  },

  // 获取月详细信息
  getDateData(date) {
    console.log(`现在是${dayjs(date).format('YYYY-MM-DD')},本月一共有${dayjs(date).daysInMonth()}天,第一天是周${dayjs(date).startOf('month').day()}`);
    const isDays = dayjs(date).daysInMonth();
    const isWeek = dayjs(date).startOf('month').day();
    let isDaysArr = [];
    // 获取日期数组
    for(let index = 0; index < isDays ; index++) {
      isDaysArr[isWeek+index] = {
        date: +index + 1,
        taskList: []
      }
    }
    console.log('fixdaysArr', isDaysArr.length, isDaysArr.length%7);
    // 补充末尾时间
    if (isDaysArr.length%7) {
      isDaysArr.length = +isDaysArr.length + 7-(isDaysArr.length%7);
    }
    console.log('daysArr', isDaysArr.length, isDaysArr.length%7);
    this.setData({
      ['calendar.days']: isDays,
      ['calendar.week']: isWeek,
      ['calendar.daysArr']: isDaysArr,
    });
  }
});
