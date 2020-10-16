// pages/author/author.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否授权
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 商户名称
    apptitle: app.globalData.apptitle,
    // 商户logo
    shoplogo: app.globalData.shoplogo,
    // code
    code: '',
    // openid
    openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let openid = app.globalData.openid
    let defaultOpenid = app.globalData.defaultOpenid
    if (openid && openid !== defaultOpenid) {
      self.setData({
        hasUserInfo: true
      })
      wx.navigateBack()
    } else if (self.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        self.setData({
          hasUserInfo: true
        })
        app.globalData.userImg = res.userInfo.avatarUrl
        wx.navigateBack()
      }
    } else {
      let self = this
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userImg = res.userInfo.avatarUrl
          // 获取code
          self.getCode()
        }
      })
    }
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

  // 获取用户信息
  getUserInfo (e) {
    let self = this
    app.globalData.userImg = e.detail.userInfo.avatarUrl
    // 获取code
    self.getCode()
  },

  // 取消授权
  cancelAuthor () {
    wx.navigateBack()
  },

  // 获取code
  getCode () {
    let self = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          self.setData({
            code: res.code
          })
        } else {
          toast.toast('登录失败！' + res.errMsg)
        }
      },
      // 接口调用结束
      complete () {
        // 获取openid
        self.getOpenID()
      }
    })
  },

  // 获取openid
  getOpenID () {
    let self = this
    let data = {
      code: self.data.code
    }
    request.http('system/customlogin.do?method=getOpenID', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        app.globalData.openid = res.data.openid
        self.setData({
          openid: res.data.openid,
          hasUserInfo: true
        })
        // 获取用户信息
        self.login()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取用户信息
  login () {
    let self = this
    let data = {
      wxID: self.data.openid,
      usercode: '',
      password: '',
      // 团秒标志，0：否；1：是 ；2：小程序自动登录
      tmFlag: 2
    }
    request.http('system/customlogin.do?method=login', data).then(result => {
      let res = result.data
      if(res.flag === 1){
        // cookie
        let sessionId = result.header['Set-Cookie']
        // 用户id
        let userid = res.data.customerid
        // 用户名称
        let memname = res.data.memname
        // 用户code
        let memcode = res.data.memcode
        //门店名称
        let deptname = res.data.shopInfo.shopname
        // 门店code
        let deptcode = res.data.shopInfo.shopcode
        // 用户身份标识，0：批发客户（app功能）；1：普通客户
        let iscustomer = res.data.iscustomer
        // 卡支付标志，1：开通；0：未开通；null：未知
        let coflag = res.data.coflag
        // 是否设置默认门店
        let isdefaultdept = res.data.isdefaultdept
        // 手机号码
        let mobile = res.data.mobile
        // 只允许普通客户登录小程序
        if (iscustomer !== 1) {
          toast.toast('当前帐号类型不正确,不可使用!')
          return false
        }
        // 设session
        if (sessionId) {
          app.globalData.sessionId = sessionId
        }
        app.globalData.userid = userid
        app.globalData.memname = memname
        app.globalData.memcode = memcode
        app.globalData.deptname = deptname
        app.globalData.deptcode = deptcode
        app.globalData.mobile = mobile
        app.globalData.coflag = coflag
      } else {
        toast.toast(res.message)
      }
      wx.navigateBack()
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
