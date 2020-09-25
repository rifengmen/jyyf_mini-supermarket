// pages/userInfo/againPay/againPay.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 订单编号
    tradeno: '',
    // 订单详情
    orderDetail: '',
    // 储值卡支付方式开关
    paymode3Flag: false,
    // 积分抵扣支付方式开关
    paymode5Flag: false,
    // 微信支付方式开关
    paymode7Flag: false,
    // 积分
    score: '',
    // 积分抵扣金额
    useScoreMoney: 0,
    // 积分使用开关
    scoreFlag: false,
    // 订单支付金额
    payMoney: 0,
    // 卡支付密码
    password: '',
    // 卡支付密码弹框
    passwordFlag: false,
    // 密码
    pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
    // focusFlag input框获取焦点开关
    focusFlag: false,
    // 点击的按钮
    frombtn: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      tradeno: options.tradeno,
    })
    // 获取订单详情
    self.getOrderDetail()
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
    let self = this
    self.setData({
      pickTypeFlag: false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
    app.globalData.addressId = ''
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

  // 获取订单详情
  getOrderDetail () {
    let self = this
    let data = {
      Tradeno: self.data.tradeno
    }
    request.http('bill/shoppingcar.do?method=buyend', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderDetail = res.data
        let paymodelist = res.data.Paymodelist
        orderDetail.tradeno = self.data.tradeno
        self.setData({
          orderDetail: orderDetail,
          paymode3Flag: (paymodelist.filter(item => item.paymodeid === 3).length ? true : false),
          paymode5Flag: (paymodelist.filter(item => item.paymodeid === 5).length ? true : false),
          paymode7Flag: (paymodelist.filter(item => item.paymodeid === 7).length ? true : false),
        })
        app.globalData.addressId = res.data.sendId
        // 设置订单支付金额
        self.setPayMoney()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取可用积分
  getScore () {
    let self = this
    let data = {
      payMoney: parseFloat(self.data.payMoney),
      Totalmoney: self.data.orderDetail.actmoney + self.data.orderDetail.freight,
    }
    self.setData({
      scoreFlag: false,
      useScoreMoney: 0,
    })
    request.http('bill/pay.do?method=payMoneyjf', data).then(result => {
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

  // 设置积分使用开关
  setScoreFlag (e) {
    let self = this
    let scoreFlag = self.data.scoreFlag
    let score = self.data.score
    if (scoreFlag) {
      self.setData({
        scoreFlag: false,
        useScoreMoney: 0
      })
    } else {
      self.setData({
        scoreFlag: true,
        useScoreMoney: score.Money,
      })
    }
    // 设置订单支付金额
    self.setPayMoney()
  },

  // 设置订单支付金额
  setPayMoney () {
    let self = this
    // 商品总金额
    let totalMoney = self.data.orderDetail.actmoney
    // 积分抵扣金额
    let useScoreMoney = self.data.useScoreMoney
    // 运费
    let freight = self.data.orderDetail.freight
    // 订单剩余支付金额
    let needpaymoney = self.data.orderDetail.needpaymoney
    let orderMoney = (totalMoney + freight).toFixed(2)
    let paid = (totalMoney + freight - needpaymoney).toFixed(2)
    let payMoney = (needpaymoney - useScoreMoney).toFixed(2)
    self.setData({
      orderMoney: orderMoney,
      paid: paid,
      payMoney: payMoney,
    })
    if (!self.data.scoreFlag) {
      // 获取可用积分
      self.getScore()
    }
  },

  // 验证支付信息完整以及是否调用密码弹框
  payVerify (e) {
    let self = this
    let address = app.globalData.address || ''
    let from = e.currentTarget.dataset.from
    self.setData({
      frombtn: from,
    })
    // 获取支付按钮
    let wechatBtn = self.selectComponent('#wechatBtn')
    if (from === 'card' || self.data.scoreFlag || self.data.tick) {
      self.setData({
        passwordFlag: true,
      })
      return false
    }
    // 支付
    wechatBtn.pay()
  },

  // 设置密码弹框开关
  setPasswordFlag () {
    let self = this
    self.setData({
      passwordFlag: !self.data.passwordFlag,
      password: '',
      pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
    })
  },

  // stops 阻止冒泡
  stops () {},

  // input框获取焦点
  focusInput () {
    let self = this
    self.setData({
      focusFlag: !self.data.focusFlag,
    })
  },

  // input框失去焦点
  blurInput () {
    let self = this
    self.setData({
      focusFlag: false,
    })
  },

  // 设置密码
  setPassword (e) {
    let self = this
    let _password = e.detail.value
    self.setData({
      password: _password,
    })
    _password = _password.split('')
    if (_password.length) {
      let pd = self.data.pd
      for (let i = 0; i < 6; i++) {
        if (_password[i]) {
          pd[i].password = '*'
          self.setData({
            pd: pd
          })
        } else {
          pd[i].password = ''
          self.setData({
            pd: pd
          })
        }
      }
    } else {
      self.setData({
        pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
      })
    }
  },

  // 密码框确认
  confirmBtn () {
    let self = this
    // 获取支付按钮
    let cardBtn = self.selectComponent('#cardBtn')
    let wechatBtn = self.selectComponent('#wechatBtn')
    let password = self.data.password
    let from = self.data.frombtn
    if (password.length < 6) {
      toast.toast('请输入支付密码')
      return false
    }
    if (from === 'card') {
      // 支付
      cardBtn.pay()
    } else if (from === 'wechat') {
      // 支付
      wechatBtn.pay()
    }

  },

})
