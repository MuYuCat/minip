// components/addIcon/addIcon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转新增
    jump2Add(e) {
      wx.navigateTo({
        url: `/pages/addTask/index?time=${this.panelTitle}`
      })
    } 
  }
})
