// pages/addTask/index.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {chackData} from '../../utils/check';
import { baseUrl } from '../../config/api';

const dayjs = require('dayjs');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 上传数据
    userId: '', // 用户id
    taskName: '', // 活动名称
    taskMsg: '', // 活动概况
    dateType: 'range', // 主活动的时间类型 默认区间日期
    selectDate: '', // 时间日历所选择时间
    beginTime: '', // 活动开始时间
    endTime: '', // 活动结束时间
    timeArr: [], // 多个活动时间的数组
    taskList: [], // 子活动列表
    // 本地数据
    showCalender: false, // 是否打开日历选择器
    showPicker: false, // 是否打开时间选择器
    isDateType: 'range', // 选择日历的类型 默认区间日期
    minDate: new Date(+dayjs().year()-1, +dayjs().month(), dayjs().date()).getTime(),// 时间日历的最小时间
    maxDate: new Date(+dayjs().year()+1, +dayjs().month(), dayjs().date()).getTime(), // 时间日历的最大时间
    timeTitle: '点击选择活动时间', // 日历时间的提示语
    isChildIndex: '', // 是否为子活动选择区间日期
    isChildType: '', // 子活动时间类型
    childChooseDate: [], // 子活动已选择日期
    confirmText: '确定', // 时间选择器确定文本
    cancleText: '取消', // 时间选择器取消文本
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.taskData) {
      const taskData = JSON.parse(options.taskData);
      console.log(options.taskData, taskData);
      this.setData({
        userId: taskData.userId || '', // 用户id
        taskName: taskData.taskName || '', // 活动名称
        taskMsg: taskData.taskMsg || '', // 活动概况
        dateType: taskData.dateType || '', // 主活动的时间类型 默认区间日期
        selectDate: taskData.selectDate || '', // 时间日历所选择时间
        beginTime: taskData.beginTime || '', // 活动开始时间
        endTime: taskData.endTime || '', // 活动结束时间
        dateArr: taskData.dateArr || '', // 多个活动时间的数组
        timeArr: taskData.timeArr || '', // 多个活动时间的数组
        taskList: taskData.taskList || '', // 子活动列表
      });
      wx.setNavigationBarTitle({
        title: '编辑活动'
      })
    } else {
      // 获取用户信息
      console.log(getApp().globalData.userInfo);
      this.setData({
        userId: getApp().globalData.userInfo.openid,
      });
    }
  },
  // 展开时间日历
  onDisplay() {
    if (this.data.taskList.length == 0) {
      Notify({ type: 'warning', message: '主活动时间在添加子活动后不可修改，请妥善选择' });
      if (!this.data.isChildIndex) {
        this.setData({ 
          minDate: new Date(+dayjs().year()-1, +dayjs().month(), dayjs().date()).getTime(),// 时间日历的最小时间
          maxDate: new Date(+dayjs().year()+1, +dayjs().month(), dayjs().date()).getTime(), // 时间日历的最大时间
        });
      }
      this.setData({ showCalender: true });
    } else {
      Notify({ type: 'danger', message: '删除所有子活动后，方可更改主活动时间！' });
      // Toast.setDefaultOptions({
      //   mask: true
      // });
      // Toast('删除子活动后，方可更改!');
    }
  },
  // 关闭时间日历
  onClose() {
    this.setData({ 
      showCalender: false,
      isChildIndex: '',
      isChildType: '',
     });
  },
  // 修改展示类型
  changeType(e) {
    if (this.data.taskList.length == 0) {
      console.log('changeType', e);
      const dateType = e.currentTarget.dataset['datetype'];
      let timeTitle = '点击选择活动时间';
      if (dateType === 'single') {
        timeTitle = '点击选择活动时间'
      } else if (dateType === 'multiple') {
        timeTitle = '点击选择多个活动时间'
      } else {
        timeTitle = '点击选择活动区间'
      }
      this.setData({
        dateType: dateType,
        isDateType: dateType,
        selectDate: '',
        beginTime: '',
        endTime: '',
        timeArr: [],
        timeTitle: timeTitle,
      });
    } else {
      Notify({ type: 'danger', message: '删除所有子活动后，方可更改主活动时间！' });
    }
  },
  // 确定日历时间
  onConfirm(event) {
    if (this.data.isChildIndex === '') {
      if (this.data.dateType === 'single') {
        this.setData({
          showCalender: false,
          beginTime: dayjs(event.detail).format('YYYY-MM-DD'),
          selectDate: `${dayjs(event.detail).format('YYYY-MM-DD')}`,
          timeTitle: '已选择单个活动时间'
        });
      } else if (this.data.dateType === 'multiple') {
        const selectDate = [];
        event.detail.map((item)=> {
          selectDate.push(dayjs(item).format('YYYY-MM-DD'))
        })
        this.setData({
          showCalender: false,
          timeArr: selectDate,
          selectDate: `选择了 ${event.detail.length} 个日期`,
          timeTitle: '已选择多个活动时间'
        });
      } else {
        const [start, end] = event.detail;
        console.log(start, end, dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD'))
        this.setData({
          showCalender: false,
          beginTime: dayjs(start).format('YYYY-MM-DD'),
          endTime: dayjs(end).format('YYYY-MM-DD'),
          selectDate: `${dayjs(start).format('YYYY-MM-DD')} - ${dayjs(end).format('YYYY-MM-DD')}`,
          timeTitle: '已选择活动区间'
        });
      }
    } else {
      console.log(`这是第${this.data.isChildIndex}个子任务的${this.data.isChildType}时间选择器`);
      if (this.data.isChildType === 'single') {
        this.setData({
          showCalender: false,
          isChildIndex: '',
          isChildType: '',
          [`taskList[${this.data.isChildIndex}].beginTime`]: dayjs(event.detail).format('YYYY-MM-DD'),
          [`taskList[${this.data.isChildIndex}].selectDate`]: `${dayjs(event.detail).format('YYYY-MM-DD')}`,
        });
      } else if (this.data.isChildType === 'multiple') {
        const selectDate = [];
        event.detail.map((item)=> {
          selectDate.push(dayjs(item).format('YYYY-MM-DD'))
        })
        this.setData({
          showCalender: false,
          isChildIndex: '',
          isChildType: '',
          [`taskList[${this.data.isChildIndex}].timeArr`]: selectDate,
          [`taskList[${this.data.isChildIndex}].selectDate`]: `选择了 ${event.detail.length} 个日期`,
        });
      } else {
        const [start, end] = event.detail;
        this.setData({
          showCalender: false,
          isChildIndex: '',
          isChildType: '',
          minDate: new Date(+dayjs().year()-1, +dayjs().month(), dayjs().date()).getTime(),
          maxDate: new Date(+dayjs().year()+1, +dayjs().month(), dayjs().date()).getTime(),
          [`taskList[${this.data.isChildIndex}].beginTime`]: dayjs(start).format('YYYY-MM-DD'),
          [`taskList[${this.data.isChildIndex}].endTime`]: dayjs(end).format('YYYY-MM-DD'),
          [`taskList[${this.data.isChildIndex}].selectDate`]: `${dayjs(start).format('YYYY-MM-DD')} - ${dayjs(end).format('YYYY-MM-DD')}`,
        });
      }
    }
  },
  // 增加子活动
  addTaskList() {
    const checkTrue = chackData(this.data);
    console.log('数据校验', checkTrue);
    if (checkTrue == 'true') {
      let isChildDate = '';
      if (this.data.dateType == 'single') {
        isChildDate = this.data.beginTime;
      }
      this.data.taskList.push({
        taskName: '',
        selectDate: isChildDate,
        dateType: 'single',
        showCalender: false,
        beginTime: isChildDate
      });
      this.setData({
        taskList: this.data.taskList,
        errorMsg: checkTrue
      });
    } else {
      this.setData({
        errorMsg: checkTrue
      });
    }
  },
  // 子活动修改名称
  changeChildName (e) {
    const taskIndex = e.currentTarget.dataset.taskindex;
    this.setData({
      [`taskList[${taskIndex}].taskName`]: e.detail,
    });
  },
  // 子活动修改概况
  changeChildMsg(e) {
    const taskIndex = e.currentTarget.dataset.taskindex;
    this.setData({
      [`taskList[${taskIndex}].taskMsg`]: e.detail,
    });
  },
  // 子活动修改时间类型
  changeTypeList (e) {
    const taskDateType = e.currentTarget.dataset.datetypelist;
    const taskIndex = e.currentTarget.dataset.taskindex;
    this.setData({
      [`taskList[${taskIndex}].dateType`]: taskDateType,
      [`taskList[${taskIndex}].beginTime`]: '',
      [`taskList[${taskIndex}].endTime`]: '',
      [`taskList[${taskIndex}].timeArr`]: [],
      [`taskList[${taskIndex}].selectDate`]: '',
    });
  },
  // 点开子活动的时间选择器
  onDisplayList (e) {
    const childdateindex = e.currentTarget.dataset.childdateindex;
    const childdatetype = e.currentTarget.dataset.childdatetype;
    console.log(e.currentTarget.dataset.childdateindex, e.currentTarget.dataset.childdatetype);
    if (this.data.dateType == 'range') {
      // 主活动是区间日期，子活动可 单个日期、多个日期、区间日期
      this.setData({
        showCalender: true,
        showPicker: false,
        isChildIndex: childdateindex, // 是第几个子活动点击的
        isChildType: childdatetype, // 子活动类型
        isDateType: childdatetype, // 日历控件的类型
        minDate:new Date(this.data.beginTime).getTime(),
        maxDate:new Date(this.data.endTime).getTime(),
      });
    } else if (this.data.dateType == 'multiple') {
      // 主活动是多个日期，子活动可 单个日期、多个日期
      let confirmText = '确定';
      let calcleText = '取消';
      if (childdatetype !== 'single') {
        confirmText = '选择'
        calcleText = '确定'
      } 
      console.log('打开时间选择', this.data.timeArr)
      this.setData({
        showCalender: false,
        showPicker: true,
        isChildIndex: childdateindex,
        isChildType: childdatetype,
        confirmText: confirmText,
        calcleText: calcleText,
      });
    }
  },
  // 关闭子活动时间选择器
  onClosePicker(){
    const changePickerColumns = this.data.timeArr;
    const resetPickerColumns = [];
    changePickerColumns.map((value)=>{
      if(value.includes('✅')) {
        resetPickerColumns.push(value.split(' ')[0]);
      } else {
        resetPickerColumns.push(value);
      }
    })
    this.setData({ 
      showPicker: false,
      isChildIndex: '',
      isChildType: '',
      timeArr: resetPickerColumns,
    });
  },
  // 取消子活动时间选择器
  onCanclePicker(){
    const changePickerColumns = this.data.timeArr;
    const resetPickerColumns = [];
    changePickerColumns.map((value)=>{
      if(value.includes('✅')) {
        resetPickerColumns.push(value.split(' ')[0]);
      } else {
        resetPickerColumns.push(value);
      }
    })
    if (this.data.isChildType == 'single') {
      // 取消按钮
      this.setData({ 
        showPicker: false,
        isChildIndex: '',
        isChildType: '',
        timeArr: resetPickerColumns,
       });
    } else {
      // 确定按钮
      this.setData({ 
        showPicker: false,
        isChildIndex: '',
        isChildType: '',
        childChooseDate: [],
        timeArr: resetPickerColumns,
        [`taskList[${this.data.isChildIndex}].timeArr`]: this.data.childChooseDate,
        [`taskList[${this.data.isChildIndex}].selectDate`]: `选择了 ${this.data.childChooseDate.length} 个日期`,
      });
    }
  },
  // 确定子活动时间选择器
  onConfirmPicker(event){
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    if (this.data.isChildType == 'single') {
      // 确定按钮
      this.setData({ 
        showPicker: false,
        isChildIndex: '',
        isChildType: '',
        childChooseDate: [],
        [`taskList[${this.data.isChildIndex}].beginTime`]: dayjs(value).format('YYYY-MM-DD'),
        [`taskList[${this.data.isChildIndex}].selectDate`]: `${dayjs(value).format('YYYY-MM-DD')}`,
      });
    } else {
      // 选择按钮
      const changePickerColumns = this.data.timeArr;
      const childChooseDate = this.data.childChooseDate;
      if(changePickerColumns[index].includes('✅')) {
        childChooseDate.splice(index, 1);
        changePickerColumns[index] = changePickerColumns[index].split(' ')[0];
      } else {
        childChooseDate.push(value);
        changePickerColumns[index] = `${changePickerColumns[index]} ✅`
      }
      console.log('子活动多个日期选择',changePickerColumns, childChooseDate);
      this.setData({
        timeArr: changePickerColumns,
        childChooseDate: childChooseDate,
      })
    }
  },
  // 删除子活动
  selTaskList(event) {
    if(['right', 'left'].includes(event.detail)) {
      const taskIndex = event.currentTarget.dataset.taskindex;
      const beforeList = this.data.taskList;
      beforeList.splice(taskIndex, 1);
      console.log('删除子活动', taskIndex, beforeList);
      this.setData({
        taskList: beforeList,
      });
    }
  },
  // 点击取消
  cancleTask () {
    console.log('cancleTask');
    // 跳转回活动列表页 且 数据不做缓存
    wx.switchTab({
      url: '../list/index',
    })
  },
  // 点击确认
  confirmTask () {
    console.log('confirmTask');
    var self = this.data;
    wx.request({
      url: `${baseUrl}/wxTask/add`,
      data: {
        userId: self.userId,
        taskName: self.taskName,
        dateType: self.dateType,
        beginTime: self.beginTime,
        endTime: self.endTime,
        dateArr: self.timeArr,
        selectDate: self.selectDate,
        taskMsg: self.taskMsg,
        taskList: JSON.stringify(self.taskList),
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success(data){
        if(data.data.code == 200) {
          Notify({ type: 'success', message: '创建活动成功！' });
          // 跳转回活动列表页
          wx.switchTab({
            url: '../list/index',
          })
        } else {
          Notify({ type: 'danger', message: '创建活动失败！' });
        }
      },
      file: res => {
        Notify({ type: 'danger', message: '创建活动失败！' });
      }
    })
  },

  // 展示测试数据
  showAllData () {
    console.log('all data', this.data);
  }
})