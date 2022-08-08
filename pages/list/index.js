// pages/index/index.js
import { baseUrl } from '../../config/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    showNoFinish: true, // 是否展示待完成
    showFinish: true, // 是否展示已完成
    taskData: [{
      beginTime: "2022-08-07",
      created_at: "2022-08-07T05:47:04.000Z",
      dateArr: "",
      dateType: "range",
      endTime: "2022-08-31",
      selectDate: "2022-08-07 - 2022-08-31",
      taskId: "5ddee880-1614-11ed-a4cf-0706b763227e",
      taskList: [],
      taskMsg: "",
      taskName: "测试重新加载",
      updated_at: "2022-08-07T05:47:05.000Z",
      userId: "ozLr04tqWf0_mvkzyQgu9cwDH9zs",
    }], // 活动列表
  },

  onLoad: function (options) {
    // 获取用户信息
    console.log(getApp().globalData.userInfo);
    this.setData({
      userInfo: getApp().globalData.userInfo,
    });
  },
  onShow: function () {
    this.onLoad();
    this.getTask(getApp().globalData.userInfo && getApp().globalData.userInfo.openid || '');
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
          self.setData({
            taskData: userTaskData
          })
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
    wx.navigateTo({
      url: `/pages/addTask/index?taskData=${JSON.stringify(this.data.taskData[index])}`
    })
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