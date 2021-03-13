// autoModule/pages/lottery/lottery.js
const app = getApp()
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 抽奖自定义设置开关
    cent_istrunbg: app.globalData.cent_istrunbg,
    // 抽奖背景图
    cent_bgurl: app.globalData.cent_bgurl || '/lib/images/lotteryBgUrl.png',
    // 抽奖转盘图
    cent_turnurl: app.globalData.cent_turnurl || '/lib/images/lotteryTurnUrl.png',
    // 抽奖按钮图
    cent_btnurl: app.globalData.cent_btnurl || '/lib/images/lotteryStart.png',
    // 谢谢图标
    thanksimg: '/lib/images/thank.png',
    // 抽奖开始标识
    startFlag: false,
    // 抽奖结束标识
    endFlag: false,
    // 抽奖开始时间
    prizeStart: '',
    // 抽奖结束时间
    prizeEnd: '',
    // 奖项
    prizeList: '',
    // 抽奖消耗积分
    prizeUseCent: 0,
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
    let baseUrl = app.globalData.baseUrl
    let cent_istrunbg = app.globalData.cent_istrunbg
    let cent_bgurl = '/lib/images/lotteryBgUrl.png'
    let cent_turnurl = '/lib/images/lotteryTurnUrl.png'
    let cent_btnurl = '/lib/images/lotteryStart.png'
    if (cent_istrunbg) {
      cent_bgurl = baseUrl + app.globalData.cent_bgurl
      cent_turnurl = baseUrl + app.globalData.cent_turnurl
      cent_btnurl = baseUrl + app.globalData.cent_btnurl
    }
    self.setData({
      cent_istrunbg: cent_istrunbg,
      cent_bgurl: cent_bgurl,
      cent_turnurl: cent_turnurl,
      cent_btnurl: cent_btnurl,
    })
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
  // onShareAppMessage: function () {
  //
  // },

  // 设置抽奖开始标识
  setStartFlag () {
    let self = this
    self.setData({
      startFlag: true
    })
  },
  // 设置抽奖结束标识
  setEndFlag () {
    let self = this
    self.setData({
      endFlag: true
    })
  },

  // 获取奖项
  getPrizeList () {
    let self = this
    let data = {}
    API.system.getPrizeList(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data && res.data.prizeList.length) {
          // 设置旋转角度
          self.setAngle(res.data.prizeList)
          self.setData({
            prizeUseCent: res.data.prizeUseCent,
            prizeStart: res.data.lotteryStart,
            prizeEnd: res.data.lotteryEnd,
          })
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置旋转角度
  setAngle (prizeList) {
    let self = this
    let baseUrl = self.data.baseUrl
    let list = prizeList
    let count = prizeList.length
    prizeList.forEach((item, index) => {
      let angle = 360 / count
      let decollatorAngle = angle / 2
      item.angle = angle * index
      item.decollatorAngle = angle * index + decollatorAngle
      if (item.prizeno === -1) {
        item.prize_bgurl = self.data.thanksimg
      } else {
        item.prize_bgurl = baseUrl + item.prize_bgurl
      }
    })
    self.setData({
      prizeList: list,
    })
  },

  // 请求抽奖结果
  getCentPrize () {
    let self = this
    let data = {}
    // 判断抽奖开始时间，拦截请求
    if (!self.data.startFlag) {
      toast.toast('本次抽奖活动还未开始，请耐心等待！')
      return false
    }
    // 判断抽奖结束时间，拦截请求
    if (self.data.endFlag) {
      toast.toast('本次抽奖活动已经结束，下次活动正在准备中！')
      return false
    }
    // 判断是否获取到奖品列表
    if (!self.data.getFlag) {
      return false
    }
    self.setData({
      getFlag: false,
    })
    API.system.centPrize(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          centPrize: res.data
        })
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
