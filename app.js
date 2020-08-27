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
              this.globalData.userInfo = res.userInfo
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
    // 商品
    barcode:null,
    // 游客openid
    defaultOpenid: "WX19000101000000000",
    // baseUrl
    baseUrl: 'http://www.91jyrj.com:8088/eshop/',
    // openid
    openid: '',
    // 会员头像
    userImg: '',
    // sessionId
    sessionId: '',
    // 搜索内容
    search_val: '',
    // 扫码次数
    codecount: 1,
    // 会员类型
    viptype: '',
    // 会员号
    memcode: '',
    // 用户名称
    memname: '',
    // 手机号
    mobile: '',
    // 店铺名称
    deptname: '',
    // 店铺code
    deptcode: '',
    // 经纬度
    longitude: '',
    latitude: '',
    // 倒计时时长
    countdownnum: '90',



    // 店铺code
    deptcode: '',
    //店面图标
    shoplogo: '../../lib/images/logo.jpg',
    //app首页图
    loadingimg: '../../img/loading.jpg',
    // 联系我们
    lianxiurl: 'https://www.91jyrj.com/eshop/upload/text/front/lianxinus.html',
    // 标题
    apptitle: '嘉元o2o'
  },

  // onHide:function(){
  //   var tuichu = wx.getStorageSync('tuichu');
  //   if (tuichu === '123') {
  //     return false
  //   }
  // },

  // 扫码次数
  count: function (arr, str) {
    let self= this
    let codecount = self.globalData.codecount
    arr.forEach(val => {
      if (str.substring(0, 2) === val.striperbarpre && str.length === val.length && codecount === 2) {
        return true;
      } else {
        return false;
      }
    })
  },

  // 是否授权
  shouquanflag:function(){
    let self = this
    let openid = self.globalData.openid
    let defaultOpenid = self.globalData.defaultOpenid
    if (openid === defaultOpenid) {
      return false ;
    } else { 
      return true;
   }
 },

  //  是否登录
  memcodeflag: function () {
    let self = this
    let memcode = self.globalData.memcode
    if (!memcode) {
      return false;
    } else {
      return true;
    }
  }
})
