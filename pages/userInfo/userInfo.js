// pages/userInfo/userInfo.js
const app = getApp()
const request = require("../../utils/request.js")
const toast = require("../../utils/toast.js")

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
    memcode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
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
    self.setData({
      openid: openid,
      memcode: memcode,
      userImg: userImg
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
        // 用户名称
        let memname = res.data.memname
        // 用户code
        let memcode = res.data.memcode
        // 店铺名称
        let deptname = res.data.shopInfo.shopname
        // 店铺code
        let deptcode = res.data.shopInfo.shopcode
        // 用户身份标识，0：批发客户（app功能）；1：普通客户
        let iscustomer = res.data.iscustomer
        // 卡支付标志，1：开通；0：未开通；null：未知
        let coflag = res.data.coflag
        // 是否设置默认店铺
        let isdefaultdept = res.data.isdefaultdept
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
        if (coflag && coflag == 1 ) {
          app.globalData.viptype = 2
        }
        // 设session
        if (sessionId) {
          app.globalData.sessionId = sessionId
        }
        app.globalData.memname = memname
        app.globalData.memcode = memcode
        app.globalData.deptname = deptname
        app.globalData.deptcode = deptcode
        // 更新页面信息
        if (self.data.memcode !== app.globalData.memcode) {
          self.setData({
            memname: memname,
            memcode: memcode
          })
        }
        // 未设置默认店铺先选择店铺
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
  }
})