// pages/userInfo/myCode/myCode.js
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
    // code类型，false：会员码；true：付款码
    codeType: false,
    // 会员卡条码
    barcode: '',
    // 会员卡二维码
    qrcode: '',
    // 付款码条码
    payBarcode: '',
    // 付款码二维码
    payQrcode: '',
    // 支付密码
    password: '',
    // 密码弹框开关
    passwordFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (!self.data.codeType) {
      // 获取会员卡
      self.getMyCard()
    }
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
      codeType: false,
      payBarcode: '',
      payQrcode: '',
      password: '',
      passwordFlag: false,
    })
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

  // 获取会员卡
  getMyCard () {
    let self = this
    let data = {
      code: app.globalData.memcode,
    }
    request.http('system/customlogin.do?method=myCard', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          barcode: res.data.mybarcode,
          qrcode: res.data.myqrcode
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取付款码
  getPayCode () {
    let self = this
    let data = {
      Cpassword: self.data.password
    }
    request.http('mem/member.do?method=createPayMoneyStr180414', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          payBarcode: res.data.payBarcode,
          payQrcode: res.data.payQrcode,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置code类型
  setCodeType (e) {
    let self = this
    let type = e.currentTarget.dataset.codetype
    let codeType
    if (type === 'card') {
      codeType = false
      self.setData({
        payBarcode: '',
        payQrcode: '',
      })
      if (!self.data.barcode && !self.data.qrcode) {
        // 获取会员卡
        self.getMyCard()
      }
    } else if (type === 'pay') {
      if (!self.data.codeType) {
        codeType = true
        // 设置密码弹框开关
        self.setPasswordFlag()
      }
    }
    self.setData({
      codeType: codeType,
    })
  },

  // 设置密码弹框开关
  setPasswordFlag () {
    let self = this
    self.setData({
      passwordFlag: !self.data.passwordFlag
    })
    if (!self.data.passwordFlag) {
      self.setData({
        codeType: false,
      })
    }
  },

  // 获取子组件支付密码
  getPassword (e) {
    let self = this
    self.setData({
      password: e.detail,
      passwordFlag: false,
    })
    // 获取付款码
    self.getPayCode()
  },
})
