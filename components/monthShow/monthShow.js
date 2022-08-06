// components/monthShow/monthShow.js
import {dateShow} from './config';
const dayjs = require('dayjs');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isDate: [], // 获取日历数据
    isTime: ''
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateShow: dateShow, // 日期标题
    thisDay: dayjs().format('D'), // 当日日期
    isSelectDay: '', // 选择日期
    showPanel: false, // 展示活动信息面板
    panelTitle: '', // 活动信息面板标题
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击选择时间
    changeClickDay(e) {
      console.log('changeClickDay', e.currentTarget.dataset.istime, e.currentTarget.dataset.systime);
      const isClickDay = e.currentTarget.dataset.istime;
      const isSysDay = e.currentTarget.dataset.systime;
      if (isClickDay && isClickDay !== this.thisDay) {
        this.setData({
          showPanel: true,
          panelTitle: `${dayjs(isSysDay).format('M')}月${isClickDay}日`,
          isSelectDay: `${isClickDay}`
        });
      } else {
        this.setData({
          showPanel: true,
          panelTitle: `${dayjs(isSysDay).format('M')}月${isClickDay}日`,
          isSelectDay: ''
        });
      }
    },
    // 关闭面板
    closePanel () {
      this.setData({
        showPanel: false,
      });
    },
    // 跳转新增
    jump2Add(e) {
      wx.navigateTo({
        url: `/pages/addTask/index?time=${this.panelTitle}`
      })
    } 
  }
})
