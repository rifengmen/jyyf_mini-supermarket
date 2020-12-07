// userInfo/pages/setPayPassword/setPayPassword.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 设置密码类型
    type: 'open',
    // 手机号
    mobile: '',
    // 身份证号码
    ID: '',
    // 支付密码
    password: '',
    // 确认密码
    againPassword: '',
    // 图形验证码
    imgCode: '',
    // 图形验证码路径
    imgCodeUrl: '',
    // 短信验证码
    messageCode: '',
    // 倒计时显示开关
    numflag: false,
    // 倒计时剩余时长
    num: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      type: options.type,
      mobile: app.globalData.mobile,
      num: app.globalData.countdownnum,
    })
    if (self.data.type === 'reset') {
      // 获取图形验证码
      self.getVerifyCodeGraphic()
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

  // 设置ID
  setID (e) {
    let self = this
    self.setData({
      ID: e.detail.value
    })
  },

  // 设置password
  setPassword (e) {
    let self = this
    self.setData({
      password: e.detail.value
    })
  },

  // 设置ID
  setAgainPassword (e) {
    let self = this
    self.setData({
      againPassword: e.detail.value
    })
  },

  // 设置支付密码
  sendPassword () {
    let self = this
    let password = self.data.password
    let againPassword = self.data.againPassword
    // 验证密码填写
    if (password.length < 6) {
      toast.toast('请填写支付密码')
      return false
    }
    // 验证确认密码填写
    if (againPassword.length < 6) {
      toast.toast('请再次填写支付密码')
      return false
    }
    // 验证密码一致
    if (password !== againPassword) {
      toast.toast('两次输入密码不一致，请重新输入')
      return false
    }
    let data = {
      IDcad: self.data.ID,
      Cpassword: password,
      Checkno: '',
      fromWhere: 'miniProgram'
    }
    API.bill.cardpayopen(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        app.globalData.coflag = 1
        wx.navigateBack()
      }
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置图形验证码
  setImgCode (e) {
    let self = this
    self.setData({
      imgCode: e.detail.value,
    })
  },

  // 设置短信验证码
  setMessageCode (e) {
    let self = this
    self.setData({
      messageCode: e.detail.value,
    })
  },

  // 获取图形验证码
  getVerifyCodeGraphic () {
    let self = this
    let data = {}
    API.system.getVerifyCodeGraphic(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let imgCodeUrl = res.data.GraphicFileName
        imgCodeUrl = imgCodeUrl.replace(/\\/g, '/')
        self.setData({
          imgCodeUrl: imgCodeUrl
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 倒计时
  countDown () {
    let self = this
    let imgCode = self.data.imgCode
    let countdownnum = app.globalData.countdownnum
    // 验证图形验证码填写
    if (!imgCode) {
      toast.toast('请填写图形验证码')
      return false
    }
    self.setData({
      numflag: true
    })
    // 倒计时
    let timer = setInterval(function(){
      countdownnum--
      self.setData({
        num:countdownnum
      })
      if (countdownnum <= 0) {
        self.setData({
          numflag: false,
          num: app.globalData.countdownnum
        })
        clearInterval(timer)
      }
    },1000)
    // 获取短信验证码
    self.getMessageCode()
  },

  // 获取短信验证码
  getMessageCode () {
    let self = this
    let data = {
      mobile: app.globalData.mobile,
      mobilecode: self.data.imgCode,
    }
    API.system.getCheckCode180126(data).then(result => {
      toast.toast(result.data.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 重置支付密码
  resetPassword () {
    let self = this
    let password = self.data.password
    let againPassword = self.data.againPassword
    let imgCode = self.data.imgCode
    let messageCode = self.data.messageCode
    // 验证图形验证码填写
    if (!imgCode) {
      toast.toast('请填写图形验证码')
      return false
    }
    // 验证短信验证码填写
    if (!messageCode) {
      toast.toast('请填写短信验证码')
      return false
    }
    // 验证密码填写
    if (password.length < 6) {
      toast.toast('请填写支付密码')
      return false
    }
    // 验证确认密码填写
    if (againPassword.length < 6) {
      toast.toast('请再次填写支付密码')
      return false
    }
    // 验证密码一致
    if (password !== againPassword) {
      toast.toast('两次输入密码不一致，请重新输入')
      return false
    }
    let data = {
      Checkno: messageCode,
      Cpassword: password,
    }
    API.bill.payPasswordReset(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateBack()
      }
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
