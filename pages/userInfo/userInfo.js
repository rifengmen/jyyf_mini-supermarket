// pages/userInfo/userInfo.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")
const utils = require("../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户头像
    userImg: '',
    // openid
    openid: '',
    // openid类型，0：游客；1：已注册
    openidType: 0,
    // 用户名称
    memname: '',
    // 会员号
    memcode: '',
    // 余额
    cardInfo: '',
    // 电子券
    tickNum: 0,
    // 积分
    score: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let openid = app.globalData.openid
    let defaultOpenid = app.globalData.defaultOpenid
    if (openid && openid !== defaultOpenid) {
      self.setData({
        openidType: 1
      })
    }
    // 是否授权登录
    self.isAuthor()
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
    let openid = app.globalData.openid
    let defaultOpenid = app.globalData.defaultOpenid
    let memcode = app.globalData.memcode
    let userImg = app.globalData.userImg
    let memname = app.globalData.memname
    self.setData({
      openid: openid,
      memcode: memcode,
      userImg: userImg,
      memname: memname
    })
    if (openid && openid !== defaultOpenid) {
      self.setData({
        openidType: 1
      })
    }
    if (openid) {
      // 获取用户信息
      self.login()
    }
    // 获取电子券数量
    self.getTickNum()
    // 获取卡余额
    self.getCardInfo()
    // 获取积分
    self.getScore()
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

  // 是否需要授权
  isAuthor () {
    let self = this
    self.setData({
      memname: app.globalData.memname
    })
    if (!self.data.openidType) {
      wx.navigateTo({
        url: '/pages/author/author'
      })
      return false
    }
  },

  // 获取用户信息
  login () {
    let self = this
    let data = {
      wxID: self.data.openid,
      usercode: '',
      password: '',
      // 团秒标志，0：否；1：是 ；2：小程序自动登录
      tmFlag: 2
    }
    request.http('system/customlogin.do?method=login', data).then(result => {
      let res = result.data
      if(res.flag === 1){
        // cookie
        let sessionId = result.header['Set-Cookie']
        // 用户id
        let userid = res.data.customerid
        // 用户名称
        let memname = res.data.memname
        // 用户code
        let memcode = res.data.memcode
        //门店名称
        let deptname = res.data.shopInfo.shopname
        // 门店code
        let deptcode = res.data.shopInfo.shopcode
        // 用户身份标识，0：批发客户（app功能）；1：普通客户
        let iscustomer = res.data.iscustomer
        // 卡支付标志，1：开通；0：未开通；null：未知
        let coflag = res.data.coflag
        // 是否设置默认门店
        let isdefaultdept = res.data.isdefaultdept
        // 手机号码
        let mobile = res.data.mobile
        // 只允许普通客户登录小程序
        if (iscustomer !== 1) {
         toast.toast('当前帐号类型不正确,不可使用!')
          return false
        }
        // 设置会员信息
        if (memcode) {
          app.globalData.viptype = 3
        }
        // 是否开通支付
        if (coflag && coflag === 1 ) {
          app.globalData.viptype = 2
        }
        // 设session
        if (sessionId) {
          app.globalData.sessionId = sessionId
        }
        app.globalData.userid = userid
        app.globalData.memname = memname
        app.globalData.memcode = memcode
        app.globalData.deptname = deptname
        app.globalData.deptcode = deptcode
        app.globalData.mobile = mobile
        app.globalData.coflag = coflag
        // 更新页面信息
        if (self.data.memcode !== app.globalData.memcode) {
          self.setData({
            memname: memname,
            memcode: memcode
          })
        }
        // 判断是否授权
        if (self.data.openidType) {
          // 更新购物车
          self.getCartCount()
        }
        // 未设置默认门店先选择门店
        // if (!isdefaultdept && memcode){
        //   wx.redirectTo({
        //     url: '../shopList/shopList',
        //   })
        // }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取电子券数量
  getTickNum () {
    let self = this
    let data = {}
    request.http('mem/member.do?method=listCoupon', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          tickNum: res.data.length
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取卡余额
  getCardInfo () {
    let self = this
    let data = {}
    request.http('mem/card.do?method=getMyCardInfo', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cardInfo: res.data
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取积分
  getScore () {
    let self = this
    let data = {
      memcode: app.globalData.memcode,
      startdate: utils.formatTime(new Date())
    }
    request.http('mem/card.do?method=listScoreDtl', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          score: res.data
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 更新购物车
  getCartCount () {
    let self = this
    let data = {}
    request.http('bill/shoppingcar.do?method=getCarProductCount', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.data) {
          wx.setTabBarBadge({
            index: 2,
            text: (res.data.data).toString()
          })
        } else {
          wx.removeTabBarBadge({
            index: 2
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
