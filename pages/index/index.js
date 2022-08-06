// index.js
const dayjs = require('dayjs');

Page({
  data: {
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
    }
  },

  onDisplay() {
  },
  onClose() {
  },
  formatDate(date) {
  },
  onConfirm(event) {
  },
  onLoad: function (options) {
    // 初始化参数
    this.setData({
      thisYear: dayjs().format('YYYY'),
      thisMonth: dayjs().format('M'),
      thisDay: dayjs().format('D'),
      currentDate: dayjs().valueOf(),
    });
    this.getDateData();
  },
  // 自定义tab切换
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&  this.getTabBar()) {
    this.getTabBar().setData({
       selected: 0
      })
    }
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
    this.getDateData(dayjs(event.detail).format('YYYY-MM-DD'))
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
      isDaysArr[isWeek+index] = +index + 1
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
