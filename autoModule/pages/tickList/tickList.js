// autoModule/pages/tickList/tickList.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 请求开关
    getFlag: false,
    // 优惠券背景
    bgurl: '/lib/images/tickBg.png',
    // 电子券列表
    tickList: [],
    // 从哪里来/组件使用的地方
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
      // 可用电子券
      self.payMoneytick()
    } else if (self.data.from === 'userInfo') {
      title = '我的电子券'
      // 我的电子券
      self.listCoupon()
    } else if (self.data.from === 'auto') {
      title = '领券中心'
      // 领券中心
      self.listCouponForGet()
    } else {
      title = '电子券'
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    // 支付开通提醒
    app.coflagTip()
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

  // 可用电子券
  payMoneytick () {
    let self = this
    let data = {
      payMoney: parseFloat(self.data.payMoney),
      Totalmoney: parseFloat(self.data.Totalmoney),
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.bill.payMoneytick(data).then(result => {
      let res = result.data
      // 设置电子券列表
      self.setListCoupon(res)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 我的电子券
  listCoupon () {
    let self = this
    let data = {}
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.mem.listCoupon(data).then(result => {
      let res = result.data
      // 设置电子券列表
      self.setListCoupon(res)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 领券中心
  listCouponForGet () {
    let self = this
    let data = {}
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.mem.listCouponForGet(data).then(result => {
      let res = result.data
      // 设置电子券列表
      self.setListCoupon(res)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置电子券列表
  setListCoupon (res) {
    let self = this
    if (res.flag === 1) {
      let tickList = res.data
      tickList.forEach(item => {
        // 优惠券简介统一字段
        if (item.dealflagdescrible) {
          item.dealflagdescription = item.dealflagdescrible
        }
        // 设置tickid，统一字段查看详情
        if (!item.onlinetickid) {
          item.onlinetickid = item.tickid
        }
        // 设置剩余数量
        let residuecount = item.totalcount - item.havepaniccount
        if (residuecount <= 0) {
          residuecount = 0
        }
        item.residuecount = residuecount
      })
      self.setData({
        tickList: tickList.reverse()
      })
      // 设置到期剩余天数
      if (self.data.from === 'userInfo') {
        self.setDays()
      }
    } else {
      toast(res.message)
    }
    // 设置请求开关
    self.setData({
      getFlag: true
    })
    wx.hideLoading()
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
    let { tick } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/autoModule/pages/tickDetail/tickDetail?from=' + self.data.from + '&tickid=' + tick.onlinetickid,
    })
  }

})
