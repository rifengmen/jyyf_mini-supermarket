// pages/login/login.js
//获取应用实例
const app = getApp()
const request = require("../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 店铺logo
    shoplogo: app.globalData.shoplogo,
    // apptitle
    apptitle: app.globalData.apptitle,
    // openid
    openid: app.globalData.openid,
    // 用户code
    usercode1: '',
    // 用户密码
    password1: '',
    // 
    auto: '',
    // 
    remember: '',
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
  onShow: function () {
    let self = this
    // 获取openid
    self.getOpenid()
    // 判断用户身份
    self.isDefaultOpenid()
    // 获取用户信息
    self.login()
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

  // 获取openid
  getOpenid () {
    let self = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let data = {
            code: res.code
          }
          request.http('system/customlogin.do?method=getOpenID', data, 'GET').then(result => {
            let res = result.data
            if (res.flag === 1) {
              app.globalData.openid = res.data.openid
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          },3000)
        }
      }
    })
  },
  
  // 判断用户身份
  isDefaultOpenid () {
    let self = this
    if (!self.data.openid )  {
      self.setData({
        openid: app.globalData.defaultOpenid
      })
    }
  },
  
  // 获取用户信息
  login () {
    let self = this
    if (self.data.openid){
      let remember = app.globalData.remember
      let auto = app.globalData.auto
      let usercode = ''
      let password1 = ''
      if (self.data.openid !== app.globalData.defaultOpenid) {
        usercode = app.globalData.usercode
        password1 = app.globalData.password1
      }
      self.setData({
        usercode1:usercode,
        password1:password1,
        auto:auto,
        remember:remember
      })
      let data = {
        wxID: self.data.openid,
        usercode: usercode,
        password: password1,
        // 团秒标志，0：否；1：是 ；2：小程序自动登录 
        tmFlag: 2
      }
      request.http('system/customlogin.do?method=login', data, 'GET').then(result => {
        let res = result.data
        if(res.flag === 1){
          let tmpusercode = res.data.usercode
          if (tmpusercode.substring(0,2) !== "WX") {
            app.globalData.usercode = tmpusercode
          }
          // cookie
          let sessionId = result.header['Set-Cookie']
          // 用户名称
          let memname = res.data.memname
          // 店铺名称
          let shopname = res.data.shopInfo.shopname
          // 店铺code
          let shopcode = res.data.shopInfo.shopcode
          // 用户code
          let memcode = res.data.memcode
          // 用户id
          let userid = res.data.customerid
          // 用户身份标识，0：批发客户（app功能）；1：普通客户
          let iscustomer = res.data.iscustomer
          // 卡支付标志，1：开通；0：未开通；null：未知
          let coflag = res.data.coflag
          // 默认门店标志
          let isdefaultdept = res.data.isDefaultDept
          // 只允许普通客户登录小程序
          if (iscustomer !== 1) {
            wx.showModal({
              title: '提示',
              content: '当前帐号类型不正确,不可使用!',
            })
            return 
          }
          // 设置会员信息
          if (memcode) {
            app.globalData.viptype = 3
            app.globalData.memcode = memcode
          }
          // 是否开通支付
          if (coflag && coflag == 1 ) {
            app.globalData.viptype = 2
          }
          app.globalData.sessionId = sessionId
          app.globalData.memname = memname
          app.globalData.shopname = shopname
          app.globalData.shopcode = shopcode
          app.globalData.userid = userid
          app.globalData.usercode = usercode
          remember = app.globalData.remember
          auto = app.globalData.auto
          if (auto) {
            app.globalData.password1 = password1
          }
          if (remember) {
            app.globalData.password1 = password1
          }
          // 未设置默认店铺先选择店铺
          if (isdefaultdept === 0){
            wx.redirectTo({
              url: '../shopList/shopList',
            })
          } else {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }else{
          wx.showModal({
            title: '提示',
            content:res.message,
            complete(res) {
               wx.navigateBack({})
            }
          })
        }
      }).catch(error => {
        wx.showToast({
          title: error.error,
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        },3000)
      })
    }
  }
})