// userInfo/pages/myCode/myCode.js
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
    // 支付开通标志,1为开通，0未开通，null未知
    coflag: 0,
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
    // 屏幕亮度
    screenBrightness: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      coflag: app.globalData.coflag,
    })
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
    let self = this
    wx.getScreenBrightness({
      success (res) {
        self.setData({
          screenBrightness: res.value
        })
      }
    })
    wx.setScreenBrightness({
      value: 1,
    })
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
    let self = this
    wx.setScreenBrightness({
      value: self.data.screenBrightness,
    })
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

  // 获取会员卡
  getMyCard () {
    let self = this
    let data = {
      code: app.globalData.memcode,
    }
    API.system.myCard(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data) {
          self.setData({
            barcode: res.data.mybarcode,
            qrcode: res.data.myqrcode
          })
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取付款码
  getPayCode () {
    let self = this
    let data = {
      Cpassword: self.data.password
    }
    API.mem.createPayMoneyStr180414(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          payBarcode: res.data.payBarcode,
          payQrcode: res.data.payQrcode,
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置code类型
  setCodeType (e) {
    let self = this
    let coflag = self.data.coflag
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
        // 判断是否开通支付
        if (coflag) {
          codeType = true
          // 设置密码弹框开关
          self.setPasswordFlag()
        } else {
          // 支付开通提醒
          app.coflagTip()
        }
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
