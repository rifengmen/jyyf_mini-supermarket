// pages/scan/editorOrder/editorOrder.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 支付方式,true:微信，false：储值卡
    payFlag: true,
    // 支付密码
    password: '',
    // 密码弹框开关
    passwordFlag: false,
    // 流水号
    flowno: '',
    // 店铺信息
    deptcode: '',
    deptname: '',
    // 订单详情
    scanOrderDetail: '',
    // 支付方式列表
    paymodeList: [],
    // 支付信息
    paylist: [],
    // 支付方式
    paymode: 7,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      flowno: options.flowno,
      deptcode: options.deptcode,
      deptname: options.deptname,
    })
    // 获取订单详情
    self.getScanOrderDetail()
    // 获取支付方式列表
    self.getPaymodeList()
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

  // 获取订单详情
  getScanOrderDetail () {
    let self = this
    let data = {
      flowno: self.data.flowno,
      deptcode: self.data.deptcode
    }
    request.http('invest/microFlow/listMicroFlowDtl', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          sacnOrderDetail: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 切换支付方式
  radioChange () {
    let self = this
    let paymode = self.data.payFlag ? 3 : 7
    self.setData({
      payFlag: !self.data.payFlag,
      paymode: paymode
    })
  },

  // 获取支付方式列表
  getPaymodeList () {
    let self = this
    let data = {
      flowno: self.data.flowno,
      shopCode: self.data.deptcode
    }
    request.http('invest/microFlow/getMicroFlowPayMoney', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          paymodeList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 是否显示密码弹框
  isSetPasswordShow () {
    let self = this
    if (self.data.paymode === 3) {
      // 设置密码弹框开关
      self.setPasswordFlag()
      return false
    }
    // 设置支付信息
    self.setPaylist()
  },

  // 设置支付信息
  setPaylist () {
    let self = this
    let globalData = app.globalData
    let paymode = self.data.paymode
    let tick = self.data.tick
    let score = self.data.score
    let orderDetail = self.data.orderDetail
    // 组合支付方式列表
    let paylist = [
      {paymode: paymode, paymoney: self.data.orderDetail.totalMoney},
    ]
    // 电子券
    if (tick) {
      let paydesc = {
        paymode: tick.paymode,
        paymoney: Number(tick.paymoney),
        ticketid: tick.tickid,
        limittype: tick.limittype,
        limitcode: tick.limitcode,
        specialflag: tick.specialflag,
        minsalemoney: tick.minsalemoney,
        tickettype: tick.tickettype,
        tickgdscode: tick.tickgdscode,
      }
      paylist.push(paydesc)
    }
    // 积分抵扣
    if (self.data.scoreFlag) {
      let paydesc = {score: score.useScore, paymoney: score.Money, memcode: globalData.memcode, paymode: 5}
      paylist.push(paydesc)
    }
    self.setData({
      paylist: paylist
    })
    // 立即支付
    self.pay()
  },

  // 立即支付
  pay () {
    let self = this
    let paymode = self.data.paymode
    let data = {
      lowno: self.data.flowno,
      payPassword: self.data.payPassword,
      channel: 'WX_MINI',
      payList: self.data.paylist,
      shopCode: self.data.deptcode
    }
    request.http('mem/member.do?method=ordercommit', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (paymode === 3) {
          wx.redirectTo({
            url: '/pages/payEnd/payEnd?text=支付成功&type=1',
          })
        } else if (paymode === 7) {
          // 微信支付
          let payStr = res.data.beecloud.miniPayStr
          self.setData({
            payStr: payStr,
          })
          self.wechatPayment()
        }
      } else {
        toast.toast(res.message)
        wx.redirectTo({
          url: '/pages/payEnd/payEnd?text=支付失败&type=0',
        })
      }
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 微信支付
  wechatPayment () {
    let self = this
    let payStr = self.data.payStr
    wx.requestPayment({
      appId: payStr.appID,
      timeStamp: payStr.timeStamp,
      nonceStr: payStr.nonceStr,
      package: payStr.package,
      signType: payStr.signType,
      paySign: payStr.paySign,
      success:function(res){
        wx.redirectTo({
          url: '/pages/payEnd/payEnd?text=支付成功&type=1',
        })
      },
      fail:function(res){
        wx.redirectTo({
          url: '/pages/payEnd/payEnd?text=支付失败&type=0',
        })
      },
      complete:function(res){}
    })
  },

  // 设置密码弹框开关
  setPasswordFlag () {
    let self = this
    self.setData({
      passwordFlag: !self.data.passwordFlag
    })
  },

  // 获取子组件支付密码
  getPassword (e) {
    let self = this
    self.setData({
      password: e.detail,
      passwordFlag: false,
    })
    // 设置支付信息
    self.setPaylist()
  },
})
