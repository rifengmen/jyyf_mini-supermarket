// pages/userInfo/addressList/addressList.js
const app = getApp()
const request = require("../../../utils/request.js")
const toast = require("../../../utils/toast.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址列表
    addressList: [],
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
    // 获取地址列表
    self.getAddressList()
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

  // 获取地址列表
  getAddressList () {
    let self = this
    let data = {}
    request.http('system/myuser.do?method=listUserAdressForDept', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          addressList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})