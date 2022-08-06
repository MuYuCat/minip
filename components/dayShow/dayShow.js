// components/dayShow/dayShow.js
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
    panelTitle: '', // 活动信息面板标题
    showLess: false // 是否缩减日期
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
          panelTitle: `${dayjs(isSysDay).format('M')}月${isClickDay}日`,
          isSelectDay: `${isClickDay}`
        });
      } else {
        this.setData({
          panelTitle: `${dayjs(isSysDay).format('M')}月${isClickDay}日`,
          isSelectDay: ''
        });
      }
    },
    // 缩小日历范围
    changeShowLess() {
      const isChange = !this.data.showLess;
      this.setData({
        showLess: isChange
      });
    },
    // 跳转新增
    jump2Add(e) {
      wx.navigateTo({
        url: `/pages/list/index?time=${this.panelTitle}`
      })
    } 
  }
})
