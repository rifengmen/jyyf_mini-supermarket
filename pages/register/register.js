// pages/register/register.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商户名称
    apptitle: app.globalData.apptitle,
    // 商户logo
    shoplogo: app.globalData.shoplogo,
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 手机号码
    mobile: '',
    // 图片
    img: '',
    // 图片验证码
    imgcode: '',
    // 倒计时显示开关
    numflag: false,
    // 倒计时剩余时长
    num: '',
    // 验证码
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 验证是否授权
    if (app.globalData.openid === app.globalData.defaultOpenid) {
      toast.toast('当前为游客,不允许注册,请授权登录再注册!')
      return false
    }
    // 获取图形验证码
    self.getVerifyCodeGraphic()
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

  // 获取图形验证码
  getVerifyCodeGraphic () {
    let self = this
    let data = {}
    request.http('system/customlogin.do?method=getVerifyCodeGraphic', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let img = res.data.GraphicFileName
        img = img.replace(/\\/g, '/')
        let sessionId = result.header['Set-Cookie']
        if (sessionId) {
          app.globalData.sessionId = sessionId
        }
        self.setData({
          img: img
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 填写手机号
  setMobile (e) {
    let self = this
    self.setData({
      mobile: e.detail.value
    })
  },

  // 填写图形验证码
  setImgcode (e) {
    let self = this
    self.setData({
      imgcode: e.detail.value
    })
  },

  // 填写短信验证码
  setCode (e) {
    let self = this
    self.setData({
      code: e.detail.value
    })
  },

  // 倒计时
  countDown () {
    let self = this
    let usercode = self.data.usercode
    let imgcode = self.data.imgcode
    let countdownnum = app.globalData.countdownnum
    // 验证手机号
    if (!usercode) {
      toast.toast('请填写手机号!')
      return false
    }
    // 验证图形验证码
    if (!imgcode) {
      toast.toast('请填写图形验证码!')
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
          num: 90
        })
        clearInterval(timer)
      }
    },1000)
    // 获取短信验证码
    self.getCheckCode()
  },

  // 获取短信验证码
  getCheckCode () {
    let self = this
    let usercode = self.data.usercode
    let imgcode = self.data.imgcode
    if (!self.data.numflag) {
      return false
    }
    let data = {
      mobile: usercode,
      mobilecode: imgcode
    }
    request.http('system/customlogin.do?method=getCheckCode180126', data).then(result => {
      toast.toast(result.data.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 注册
  perfectInfoForWX () {
    let self = this
    let mobile = self.data.mobile
    let code = self.data.code
    // 验证手机号
    if (!mobile) {
     toast.toast('请填写手机号!')
      return false
    }
    // 验证图形验证码
    if (!code) {
      toast.toast('请填写短信验证码!')
      return false
    }
    let data = {
      mobile: mobile,
      checkcode: code
    }
    request.http('system/customlogin.do?method=perfectInfoForWX', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        toast.toast('注册成功!', 'userInfo')
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
