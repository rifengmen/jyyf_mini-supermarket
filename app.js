// app.js
const request = require('./utils/request.js')

App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userImg = res.userInfo.avatarUrl
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },

  // 全局变量
  globalData: {
    // 游客openid
    defaultOpenid: "WX19000101000000000",
    // baseUrl
    // baseUrl: 'http://192.168.29.100:8088/simple-eshop/',
    baseUrl: 'https://www.91jyrj.com/eshop/',
    // baseUrl: 'http://192.168.1.22:8089/eshop/',
    // baseUrl: 'https://www.jwkgou.com:8443/simple-eshop/',
    // openid
    openid: '',
    // 会员头像
    userImg: '',
    // sessionId
    sessionId: '',
    // 搜索内容
    search_val: '',
    // 用户id
    userid: '',
    // 用户code
    memcode: '',
    // 用户名称
    memname: '',
    // 手机号
    mobile: '',
    // 支付开通标志,1为开通，0未开通，null未知
    coflag: 0,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 经纬度
    longitude: '',
    latitude: '',
    // 倒计时时长
    countdownnum: '90',
    // 购物车数量
    cartCount: 0,
    // 收货地址(编辑订单用)
    address: '',
    // 地址id
    addressId: '',
    // 地址详情(编辑地址用)
    addressDetail: '',
    // 扫码购
    // 扫码购店铺
    scanShopInfo: '',
    // 扫码购购物车
    scanCart: [],



    // 商家code
    shopcode: '',
    // 商家图标
    shoplogo: '/lib/images/logo.jpg',
    // app首页图
    loadingimg: '/lib/images/loading.jpg',
    // 联系我们
    webUrl: 'https://www.91jyrj.com/eshop/upload/text/front/lianxinus.html',
    // app标题
    apptitle: '嘉元o2o'
  },

  // onHide:function(){
  //   var tuichu = wx.getStorageSync('tuichu');
  //   if (tuichu === '123') {
  //     return false
  //   }
  // },

  // 扫码次数
  count (arr, str) {
    let self= this
    let codecount = self.globalData.codecount
    arr.forEach(val => {
      if (str.substring(0, 2) === val.striperbarpre && str.length === val.length && codecount === 2) {
        return true
      } else {
        return false
      }
    })
  },

  // 是否授权
  authorFlag () {
    let self = this
    let openid = self.globalData.openid
    let defaultOpenid = self.globalData.defaultOpenid
    if (openid === defaultOpenid) {
      return false
    } else {
      return true
   }
 },

  //  是否注册
  memcodeflag () {
    let self = this
    let memcode = self.globalData.memcode
    if (!memcode) {
      return false
    } else {
      return true
    }
  }
})
