// pages/autoModule/lotteryList/lotteryList.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求开关
    getFlag: false,
    // 中奖记录列表
    lotteryList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 获取中奖记录列表
    self.getLotteryList()
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

  // 获取中奖记录列表
  getLotteryList () {
    let self = this
    let data = {
      startdate: utils.formatTime(new Date())
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http('system/prize.do?method=listPrizeLog', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          lotteryList: res.data
        })
      } else {
        toast.toast(res.message)
      }
      wx.hideLoading()
      // 设置请求开关
      self.setData({
        getFlag: true
      })
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
