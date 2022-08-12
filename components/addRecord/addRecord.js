// components/addRecord/addRecord.js
import {getStatus, getTag} from '../../utils/check';
import { baseUrl } from '../../config/api';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isData: [], // 打卡数据
    isType: '' // 打卡类型
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true, // 永久展示弹框
    justOne: true, // 是否仅仅为一个主活动
    childTask: [], // 预处理后子活动
  },

  // 对值进行预处理
  ready: function () {
    console.log('获取父组件的值', this.properties.isData, this.properties.isType);
    const fatherData = this.properties.isData;
    if (fatherData.taskList.length == 0) {
      this.setData({
        justOne: true,
      })
    } else {
      const childTask = fatherData.taskList;
      childTask.map((task)=> {
        if (fatherData.status == 'stop') {
          task.status = 'stop';
          task.showStatus = '已中止';
        } else {
          task.status = getStatus(task);
          // console.log('task.status', task.status);
          task.showStatus = getTag(task.status);
        }
      })
      this.setData({
        justOne: false,
        childTask: childTask,
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭组件
    onClose() {
      console.log('子组件关闭弹窗');
      this.triggerEvent("closeShowRecord",false);
    },
    // 修改活动进度
    onDrag(event) {
      const index = event.currentTarget.dataset.index;
      const type = event.currentTarget.dataset.type;
      const main = event.currentTarget.dataset.main;
      // console.log('onDrag', index, type);
      if(!main) {
        if (this.data.childTask[index].status !== 'ing') return
        // 子活动的增填删改
        const allRecord = this.data.childTask.length * 100; // 总分数
        let thisRecord = 0; // 目前得分
        let changeProgress = 0;
        if (type == 'plus') {
          if (this.data.childTask[index].progress > 99) {
            return
          } else {
            changeProgress = parseInt(this.data.childTask[index].progress || 0) + 1;
            // console.log(this.data.childTask[index].progress, changeProgress)
          }
        } else if (type == 'minus') {
          if (this.data.childTask[index].progress < 1) {
            return
          } else {
            changeProgress = parseInt(this.data.childTask[index].progress || 0) - 1;
          }
        } else {
          changeProgress = event.detail.value;
        }
        this.data.childTask[index].progress = changeProgress;
        this.data.childTask.map((task)=>{
          const progress = parseInt(task.progress || 0);
          thisRecord = thisRecord + progress;
          // console.log('thisRecord', thisRecord);
        })
        const taskProgress = Math.round((thisRecord/allRecord)*100);
        // console.log('onDrag', changeProgress, thisRecord, taskProgress);
        this.setData({
          [`childTask[${index}].progress`]: changeProgress,
          ['isData.progress']: taskProgress,
        });
      } else {
        if (this.properties.isData.status !== 'ing') return
        // 主活动的增添删改
        let changeProgress = 0;
        if (type == 'plus') {
          if (this.properties.isData.progress > 99) {
            return
          } else {
            changeProgress = parseInt(this.properties.isData.progress || 0) + 1;
          }
        } else if (type == 'minus') {
          if (this.properties.isData.progress < 1) {
            return
          } else {
            changeProgress = parseInt(this.properties.isData.progress || 0) - 1;
          }
        } else {
          changeProgress = event.detail.value;
        }
        this.setData({
          ['isData.progress']: changeProgress,
        });
      }
    },
    // 确定修改进度
    confirmProgress(e) {
      console.log('确定更新')
      const self = this;
      this.properties.isData.taskList = JSON.stringify(this.data.childTask);
      console.log('确定更新',this.properties.isData.taskList)
      wx.request({
        url: `${baseUrl}/wxTask/update`,
        data: this.properties.isData,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success(data){
          if(data.data.code == 200) {
            Notify({ type: 'success', message: '更新活动成功！' });
            // 跳转回活动列表页
            self.onClose();
          } else {
            Notify({ type: 'danger', message: '更新活动失败！' });
          }
        },
        file: res => {
          Notify({ type: 'danger', message: '更新活动失败！' });
        }
      })
    },
    // 放弃修改
    cancleProgress() {
      this.onClose();
    }
  }

})
