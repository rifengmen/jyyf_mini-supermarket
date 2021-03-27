// pages/register/register.js
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商户名称
    apptitle: app.globalData.apptitle,
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 主题背景色
    home_bgcolor: '',
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
    let self = this
    self.setData({
      home_bgcolor: app.globalData.home_bgcolor || '#71d793',
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
    // 验证是否授权
    if (app.globalData.openid === app.globalData.defaultOpenid) {
      toast('当前为游客,不允许注册,请授权登录再注册!')
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取图形验证码
  getVerifyCodeGraphic () {
    let self = this
    let data = {}
    API.system.getVerifyCodeGraphic(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let img = res.data.GraphicFileName
        img = img.replace(/\\/g, '/')
        self.setData({
          img: img
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
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
    let mobile = self.data.mobile
    let imgcode = self.data.imgcode
    let countdownnum = app.globalData.countdownnum
    // 验证手机号
    if (!mobile) {
      toast('请填写手机号!')
      return false
    }
    // 验证图形验证码
    if (!imgcode) {
      toast('请填写图形验证码!')
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
    let mobile = self.data.mobile
    let imgcode = self.data.imgcode
    if (!self.data.numflag) {
      return false
    }
    let data = {
      mobile: mobile,
      mobilecode: imgcode
    }
    API.system.getCheckCode180126(data).then(result => {
      toast(result.data.message)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 注册
  perfectInfoForWX () {
    let self = this
    let mobile = self.data.mobile
    let code = self.data.code
    // 验证手机号
    if (!mobile) {
     toast('请填写手机号!')
      return false
    }
    // 验证图形验证码
    if (!code) {
      toast('请填写短信验证码!')
      return false
    }
    let data = {
      mobile: mobile,
      checkcode: code
    }
    API.system.perfectInfoForWX(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 获取用户信息
        self.login()
        toast('注册成功!', 'userInfo')
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取用户信息
  login () {
    let self = this
    let data = {
      wxID: app.globalData.openid,
      usercode: '',
      password: '',
      // 团秒标志，0：否；1：是 ；2：小程序自动登录
      tmFlag: 2
    }
    API.system.login(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 用户id
        let userid = res.data.customerid
        // 手机号码
        let mobile = res.data.mobile
        // 用户名称
        let memname = res.data.memname
        // 用户code
        let memcode = res.data.memcode
        // 用户身份标识，0：批发客户（app功能）；1：普通客户
        let iscustomer = res.data.iscustomer
        // 身份信息，0：顾客；1：配送员；2：团长
        let role = res.data.role
        // 卡支付标志，1：开通；0：未开通；null：未知
        let coflag = res.data.coflag
        // 只允许普通客户登录小程序(批发客户不能登录)
        if (iscustomer !== 1) {
          toast('当前帐号类型不正确,不可使用!')
          return false
        }
        app.globalData.userid = userid
        app.globalData.mobile = mobile
        app.globalData.memname = memname
        app.globalData.memcode = memcode
        app.globalData.role = role
        app.globalData.coflag = coflag
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
