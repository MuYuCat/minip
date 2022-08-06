import {USER_PAGE} from "../config/common"
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    "list": []
  },
  attached() {
    let roldId = wx.getStorageSync('roldId');
    // 0 表示普通用户 1表示管理员
    if(roldId == 0){
      this.setData({
        list: USER_PAGE.memberTabbarList
      })
    }else if(roldId == 1){
      this.setData({
        list: USER_PAGE.adminTabbarList
      })
    }else{
      this.setData({
        list: USER_PAGE.memberTabbarList
      })
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  }
})