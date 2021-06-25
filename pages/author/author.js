// pages/author/author.js
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商户名称
    apptitle: '',
    // openid
    openid: '',
    // 是否短信校验,0：校验；1：不校验
    isphonecode: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      apptitle: app.globalData.apptitle,
      openid: app.globalData.openid,
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

  // 获取手机号码
  getPhoneNumber(e) {
    let self = this
    let detail = e.detail
    if (detail.errMsg === 'getPhoneNumber:ok' && detail.iv && detail.encryptedData) {
      let data = {
        iv: detail.iv,
        encryptedData: detail.encryptedData
      }
      wx.showLoading({
        title: '请求等待中...',
        mask: true,
      });
      API.system.bindOpenID(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          self.setData({
            mobile: res.data.phone,
          })
          // 注册
          self.perfectInfoForWX()
        } else {
          toast(res.message)
        }
      }).catch(error => {
        wx.hideLoading();
        toast(error.error)
      })
    } else {
      // 取消授权
      self.cancelAuthor()
    }

  },

  // 取消授权
  cancelAuthor() {
    wx.navigateBack()
  },

  // 注册
  perfectInfoForWX() {
    let self = this
    let data = {
      isphonecode: self.data.isphonecode,
      mobile: self.data.mobile,
    }
    API.system.perfectInfoForWX(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 获取用户信息
        self.login()
        toast('注册成功!')
      } else {
        toast(res.message)
      }
    }).catch(error => {
      wx.hideLoading();
      toast(error.error)
    })
  },

  // 获取用户信息
  login() {
    let self = this
    let data = {
      wxID: self.data.openid,
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
      wx.navigateBack()
    }).catch(error => {
      toast(error.error)
    })
    wx.hideLoading();
  },
})
