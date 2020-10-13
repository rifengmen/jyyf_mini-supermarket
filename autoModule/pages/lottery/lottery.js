// autoModule/pages/lottery/lottery.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 抽奖背景图
    lotteryBg: 'lib/images/lotteryBg.png',
    // 积分
    score: '',
    // 消耗积分
    prizeUseCent: '',
    // 奖项
    prizeList: '',
    // 抽奖开关
    getFlag: true,
    // 抽奖结果
    centPrize: '',
    // 抽奖结果下标
    centPrizeIndex: 0,
    // 基础旋转角度
    baseRotate: 2160,
    // 旋转角度
    rotate: 0,
    // 旋转动画
    animationData: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 获取积分
    self.getScore()
    // 获取奖项
    self.getPrizeList()
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

  // 获取积分
  getScore () {
    let self = this
    let data = {
      memcode: app.globalData.memcode,
      startdate: utils.formatTime(new Date()),
    }
    request.http('mem/card.do?method=listScoreDtl', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          score: res.data,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取奖项
  getPrizeList () {
    let self = this
    let data = {}
    request.http('system/prize.do?method=getPrizeList', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.prizeList.length) {
          self.setData({
            prizeUseCent: res.data.prizeUseCent,
          })
          // 设置旋转角度
          self.setAngle(res.data.prizeList)
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置旋转角度
  setAngle (prizeList) {
    let self = this
    let list = prizeList
    let count = prizeList.length
    prizeList.forEach((item, index) => {
      let angle = 360 / count
      let decollatorAngle = angle / 2
      item.angle = angle * index
      item.decollatorAngle = angle * index + decollatorAngle
    })
    self.setData({
      prizeList: list,
    })
  },

  // 请求抽奖结果
  getCentPrize () {
    let self = this
    let data = {}
    if (!self.data.getFlag) {
      return false
    }
    self.setData({
      getFlag: false,
    })
    request.http('system/prize.do?method=centPrize', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          centPrize: res.data
        })
        // 获取积分
        self.getScore()
        // 设置抽奖结果下标
        self.setCentPrizeIndex(res.data)
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置抽奖结果下标
  async setCentPrizeIndex (data) {
    let self = this
    let prizeList = self.data.prizeList
    prizeList.forEach((item, index) => {
      if (item.prizeno === data.prizeno) {
        self.setData({
          centPrizeIndex: index
        })
      }
    })
    // 获取奖项对应的角度
    let angle = prizeList[self.data.centPrizeIndex].angle
    // 旋转方法
    self.startRotate(angle, () => {
      // 获取积分
      self.getScore()
      // 弹出抽奖结果
      wx.showModal({
        title: '恭喜',
        content: self.data.centPrize.prizename,
        showCancel: false,
      })
    })
  },

  // 旋转方法
  startRotate (angle, callBack) {
    let self = this
    let baseRotate = self.data.baseRotate
    // 旋转角度
    let rotate = baseRotate + parseFloat(angle)
    // 旋转
    const animation = wx.createAnimation({
      duration: 5000,
      timingFunction: "ease",
    })
    self.animation = animation
    animation.rotate(rotate).step()
    self.setData({
      animationData: animation.export()
    })
    clearTimeout(self.timer)
    self.timer = setTimeout(() => {
      self.setData({
        getFlag: true,
        baseRotate: self.data.baseRotate + 2160,
        animationData: {},
      })
      callBack()
    }, 5000)
  },

})
