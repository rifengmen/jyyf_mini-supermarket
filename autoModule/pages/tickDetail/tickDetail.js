// autoModule/pages/tickDetail/tickDetail.js
const app = getApp()
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tickid
    tickid: '',
    // 电子券详情
    tickDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      from: options.from,
      tickid: options.tickid,
    })
    // 获取电子券详情
    self.getTickDetail()
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取电子券详情
  getTickDetail () {
    let self = this
    let data = {
      tickid: self.data.tickid,
    }
    API.mem.getCouponDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let tickDetail = res.data
        let residuecount = tickDetail.totalcount - tickDetail.havepaniccount
        if (residuecount < 0) {
          residuecount = 0
        }
        tickDetail.residuecount = residuecount
        self.setData({
          tickDetail: tickDetail,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
