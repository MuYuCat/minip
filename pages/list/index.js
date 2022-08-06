// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNoFinish: true, // 是否展示待完成
    showFinish: true, // 是否展示已完成
    taskData: [
      {
        title: '测试数据',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      },
      {
        title: '测试数据',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      },
      {
        title: '测试数据',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      },
      {
        title: '测试数据',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      },
      {
        title: '测试数据',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      },
      {
        title: '测试数据',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      },
      {
        title: '测试数据1',
        beginTime: '2022-8-21',
        endTime: '2022-8-25',
        totalNum: '100',
        finishNum: '10'
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 自定义tab切换
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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