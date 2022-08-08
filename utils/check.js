import Notify from '../miniprogram_npm/@vant/weapp/notify/notify';
const dayjs = require('dayjs');

const chackData =(data) => {
  let isResult = 'true';
  if(!data.taskName) {
    Notify({ type: 'warning', message: '请输入主活动名称' });
    isResult =  'taskName';
  } else if(data.dateType == 'single' && !data.beginTime) {
    Notify({ type: 'warning', message: '请选择主活动时间' });
    isResult =  'taskTime';
  } else if(data.dateType == 'multiple' && data.timeArr.length == 0) {
    Notify({ type: 'warning', message: '请选择主活动时间' });
    isResult =  'taskTime';
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
      } else if(taskItem.dateType == 'multiple' && taskItem.timeArr.length == 0) {
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

const isFinishTask = (data) => {
  switch (data.dateType) {
    case 'multiple' : {
      const dateArr = data.dateArr.split(',');
      if (dayjs().isBefore(dayjs(dateArr[0]))) {
        return 'before';
      } else if (dayjs().isAfter(dayjs(dateArr[dateArr.length-1]))) {
        return 'after';
      } else if (data.dateArr.includes(dayjs().format('YYYY-MM-DD'))) {
        return 'ing';
      } else {
        return 'between';
      }
    }
    default: {
      if (dayjs().isBefore(dayjs(data.beginTime))) {
        return 'before';
      } else if (dayjs().isAfter(dayjs(data.beginTime))) {
        return 'after';
      } else {
        return 'ing';
      }
    }
  }
}

module.exports = {
  chackData,
  isFinishTask
}