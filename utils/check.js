import Notify from '../miniprogram_npm/@vant/weapp/notify/notify';
const dayjs = require('dayjs');

// 校验数据
const chackData =(data) => {
  let isResult = 'true';
  if(!data.taskName) {
    Notify({ type: 'warning', message: '请输入主活动名称' });
    isResult =  'taskName';
  } else if(data.dateType == 'single' && !data.beginTime) {
    Notify({ type: 'warning', message: '请选择主活动时间' });
    isResult =  'taskTime';
  } else if(data.dateType == 'multiple') {
    console.log(data.type, data.dateArr);
    if (data.type == 'edit' && data.dateArr === '') {
      console.log(data.type == 'edit', data.dateArr === '');
      Notify({ type: 'warning', message: '请选择主活动时间' });
      isResult =  'taskTime';
    } else if (!data.type && data.timeArr.length == 0) {
      Notify({ type: 'warning', message: '请选择主活动时间' });
      isResult =  'taskTime';
    }
  } else if (data.dateType == 'range' && !(data.beginTime || data.endTime)) {
    Notify({ type: 'warning', message: '请选择主活动时间' });
    isResult =  'taskTime';
  } else if (data.taskList.length !== 0) {
    data.taskList.map((taskItem, index)=> {
      console.log(taskItem, index);
      if (!taskItem.taskName) {
        Notify({ type: 'warning', message: `请输入第${+index+1}个子活动的名称` });
        isResult =  `child-${index}-taskName`;
      } else if (taskItem.dateType == 'single' && !taskItem.beginTime) {
        Notify({ type: 'warning', message: `请选择第${+index+1}个子活动的时间` });
        isResult =  `child-${index}-taskTime`;
      } else if(taskItem.dateType == 'multiple' && taskItem.timeArr == '') {
        Notify({ type: 'warning', message: `请选择第${+index+1}个子活动的时间` });
        isResult =  `child-${index}-taskTime`;
      } else if (taskItem.dateType == 'range' && !(taskItem.beginTime || taskItem.endTime)) {
        Notify({ type: 'warning', message: `请选择第${+index+1}个子活动的时间` });
        isResult =  `child-${index}-taskTime`;
      } else {
        isResult =  'true';
      }
    })
  } else {
    isResult =  'true';
  }
  return isResult;
}

// 获取活动状态
const getStatus = (data) => {
  switch (data.dateType) {
    case 'multiple' : {
      const dateArr = data.dateArr.split(',');
      let maxDate = dateArr[0];
      let minDate = dateArr[0];
      dateArr.map((item)=> {
        dayjs(item).isAfter(maxDate) ? maxDate = item : ''
        dayjs(item).isBefore(minDate) ? minDate = item : ''
      })
      console.log(dateArr, minDate, maxDate)
      if (dayjs().isBefore(dayjs(minDate))) {
        return 'before';
      } else if (dayjs().isAfter(dayjs(maxDate))) {
        return 'after';
      } else if (data.dateArr.includes(dayjs().format('YYYY-MM-DD'))) {
        return 'ing';
      } else {
        return 'between';
      }
    }
    case 'single' : {
      if (dayjs().isBefore(dayjs(data.beginTime), 'day')) {
        return 'before';
      } else if (dayjs().isAfter(dayjs(data.beginTime), 'day')) {
        return 'after';
      } else {
        return 'ing';
      }
    }
    default: {
      if (dayjs().isBefore(dayjs(data.beginTime), 'day')) {
        return 'before';
      } else if (dayjs().isAfter(dayjs(data.endTime), 'day')) {
        return 'after';
      } else {
        return 'ing';
      }
    }
  }
}

// 获取标签
const getTag =  (status) => {
  console.log('status',status);
  switch(status) {
    case 'before': {
      return '未开始'
    }
    case 'after': {
      return '已截止'
    }
    case 'ing': {
      return '进行中'
    }
    case 'between': {
      return '非本日'
    }
    default: {
      return '异常'
    }
  }
}

module.exports = {
  chackData,
  getStatus,
  getTag
}