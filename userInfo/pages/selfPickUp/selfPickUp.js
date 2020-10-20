// userInfo/pages/selfPickUp/selfPickUp.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 名字
    username: '',
    // 手机号
    phone: '',
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
    let self= this
    self.setData({
      phone: app.globalData.mobile,
    })
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
    let self = this
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

  // 设置名字
  setName (e) {
    let self = this
    self.setData({
      username: (e.detail.value).trim()
    })
  },

  // 设置手机号
  setPhone (e) {
    let self = this
    self.setData({
      phone: (e.detail.value).trim()
    })
  },

  // 确认
  confirm () {
    let self = this
    // 验证名字
    if (!self.data.username) {
      toast.toast('请填写名字')
      return false
    }
    // 验证手机号
    if (!self.data.phone) {
      toast.toast('请填写手机号')
      return false
    }
    app.globalData.address = {
      pickType: 0,
      username: self.data.username,
      phone: self.data.phone
    }
    app.globalData.addressId = ''
    wx.navigateBack()
  },
})
