// app.js
import { baseUrl } from './config/api';

App({
  onLaunch: function () {
    this.loginIn();
  },
  globalData:{
    userInfo:null
  },
  // 获取用户token
  loginIn () {
    var self = this;
    wx.getStorage({
      key: 'minip_userid',
      success (res) {
        // console.log('用户残留痕迹', res.data);
        const cookie_id = res.data;
        if (cookie_id) {
          self.getUserInfo(cookie_id);
        } else {
          self.getOpenId();
        }
      },
      fail: res => {
        wx.removeStorage({key: 'minip_userid'}); // 移除无用openid
        self.getOpenId();
      }
    });
  },
  // 查询用户信息
  getUserInfo (id) {
    var self = this;
    wx.request({
      url: `${baseUrl}/wxLogin/find`,
      data: {
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success(data){
        if(data.data.code == 200) {
          self.globalData.userInfo = data.data.data.rows[0];
        } else {
          // 查询不到用户信息/新增用户
          self.addUser(id);
        }
      },
      file: res => {
        // 未查询到用户信息/弹toast/显示未登陆
      }
    })
  },
  // 新增用户
  addUser (id) {
    var self = this;
    wx.request({
      url: `${baseUrl}/wxLogin/add`,
      data: {
        id: id
      },
      header: {
       "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success(data){
        if(data.data.code === 200) {
          // 新增用户成功/跳转信息页面
        } else {
          // 新增用户失败/弹toast/显示未登陆
        }
      },
      fail: res => {
        // 新增用户失败/弹toast/显示未登陆
      }
    })
  },
  // 获取用户openid
  getOpenId () {
    wx.login({
      success: res => {
        // console.log('login', res)
        if(res.code) {
          wx.request({
            url: `${baseUrl}/wxLogin/getSession`,
            data: {
              code: res.code
            },
            header: {
             "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success(data){
              // console.log('url data', data.data.openid);
              if (data.data.openid) {
                wx.setStorage({
                  key:"minip_userid",
                  data: data.data.openid
                });
              } else {
                // console.log('获取openid失败');
              }
            }
          });
        } else {
          // console.log('无cookie_id')
        }
      },
      fail: res => {
        // console.log('无cookie_id')
      }
    })
  }
})
