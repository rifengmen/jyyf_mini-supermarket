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
    shoplogo: app.globalData.shoplogo
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
    request.http('system/customlogin.do?method=getOpenID', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        app.globalData.openid = res.data.openid
        self.setData({
          openid: res.data.openid,
          hasUserInfo: true
        })
        wx.navigateBack()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
