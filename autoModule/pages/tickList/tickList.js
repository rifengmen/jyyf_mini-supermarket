// autoModule/pages/tickList/tickList.js
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
    // 电子券列表
    tickList: [],
    // 从哪里来
    from: '',
    // 支付金额
    payMoney: 0,
    // 订单商品金额
    Totalmoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      from: options.from || '',
      payMoney: options.payMoney || 0,
      Totalmoney: options.Totalmoney || 0,
    })
    // 设置title
    let title = ''
    if (self.data.from === 'editorOrder') {
      title = '选择电子券'
      // 选择电子券页面
      self.getEditorOrder()
    } else if (self.data.from === 'userInfo') {
      title = '我的电子券'
      // 我的电子券页面
      self.getUserInfo()
    } else if (self.data.from === 'auto') {
      title = '领券中心'
      // 领券中心页面
      self.getAuto()
    } else {
      title = '电子券'
    }
    wx.setNavigationBarTitle({
      title: title,
    })
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
    app.globalData.tick = ''
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

  // 使用电子券页面
  getEditorOrder () {
    let self = this
    let data = {
      payMoney: parseFloat(self.data.payMoney),
      Totalmoney: parseFloat(self.data.Totalmoney),
    }
    let url = 'bill/pay.do?method=payMoneytick'
    // 获取电子券列表
    self.getTickList(url, data)
  },

  // 我的电子券页面
  getUserInfo () {
    let self = this
    let data = {}
    let url = 'mem/member.do?method=listCoupon'
    // 获取电子券列表
    self.getTickList(url, data)
  },

  // 领券中心页面
  getAuto () {
    let self = this
    let data = {}
    let url = 'mem/member.do?method=listCouponForGet'
    // 获取电子券列表
    self.getTickList(url, data)
  },

  // 获取电子券列表
  getTickList (url, data) {
    let self = this
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http(url, data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let tickList = res.data
        tickList.forEach(item => {
          if (item.dealflagdescrible) {
            item.dealflagdescription = item.dealflagdescrible
          }
        })
        self.setData({
          tickList: tickList
        })
        // 设置到期剩余天数
        if (self.data.from === 'userInfo') {
          self.setDays()
        }
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

  // 设置到期剩余天数
  setDays () {
    let self = this
    let tickList = self.data.tickList
    tickList.forEach(item => {
      // 计算剩余天数
      item.days = self.getDays(item.enddate)
    })
    self.setData({
      tickList: tickList,
    })
  },

  // 计算剩余天数
  getDays (enddate) {
    let self = this
    let endTime = enddate.replace(/-/g, '/')
    endTime = Date.parse(utils.formatTime(new Date(endTime)))
    let nowTime = Date.parse(utils.formatTime(new Date()))
    let times = endTime - nowTime
    let days = Math.ceil(times / 1000 / 60 / 60 / 24)
    if (days <= 0) {
      days = 0
    }
    return days
  },

  // 去电子券详情
  toTickDetail (e) {
    let self = this
    let tickid = e.currentTarget.dataset.tickid
    let from = self.data.from
    if (from === 'auto') {
      wx.navigateTo({
        url: '/autoModule/pages/tickDetail/tickDetail?tickid=' + tickid,
      })
    }
  }

})
