// pages/index/index.js
import { baseUrl } from '../../config/api';
import { getStatus } from '../../utils/check';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    showNoFinish: true, // 是否展示待完成
    showFinish: true, // 是否展示已完成
    taskData: [], // 所有活动列表
    runningTask: [], // 正在进行中的任务
    silenceTask: [], // 未进行的任务
  },

  onLoad: function (options) {
    // 获取用户信息
    console.log(getApp().globalData.userInfo);
    this.setData({
      userInfo: getApp().globalData.userInfo,
    });
  },
  onShow: function () {
    // 获取任务信息
    this.onLoad();
    this.getTask(getApp().globalData.userInfo && getApp().globalData.userInfo.openid || '');
  },


  // 给任务加状态
  getTaskStatus: function (data) {
    const runningTask = []; // 正在进行中的任务
    const silenceTask = []; // 未进行的任务
    data.map((task)=>{
      task.status = getStatus(task);
      console.log('task.status', task.status);
      if(task.status === 'after') {
        silenceTask.push(task);
      } else {
        runningTask.push(task);
      }
    })
    this.setData({
      taskData: data,
      silenceTask: silenceTask,
      runningTask: runningTask,
    });
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
          console.log('查询用户信息', data.data.data);
          const userTaskData = data.data.data;
          // 获取任务信息
          self.getTaskStatus(userTaskData);
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

  // 跳转到详情
  jump2show(e){
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    if (type) {
      wx.navigateTo({
        url: `/pages/addTask/index?type=${type || ''}&taskData=${JSON.stringify(this.data.silenceTask[index])}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/addTask/index?taskData=${JSON.stringify(this.data.runningTask[index])}`
      })
    }
  },
  // 关闭已完成部分
  closeFinish: function (e) {
    const type = e.currentTarget.dataset.type;
    console.log('closeFinish', type, type == 'noFinish');
    if (type == 'noFinish') {
      const isChange = !this.data.showNoFinish;
      this.setData({
        showNoFinish: isChange,
      });
    } else {
      const isChange = !this.data.showFinish;
      this.setData({
        showFinish: isChange,
      });
    }
  }
})