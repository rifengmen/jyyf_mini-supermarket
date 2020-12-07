// app.js
const toast = require('./utils/toast.js')

App({
  onLaunch: function () {
    let self = this
    // 新版本校验
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            toast.toast('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~')
          })
        }
      })
    } else {
      toast.toast('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userImg = res.userInfo.avatarUrl
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
    // 当前线上版本号
    version: '',
    // openid
    openid: '',
    // 会员头像
    userImg: '',
    // sessionId
    sessionId: '',
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
    // 身份标识，默认0,0:顾客,1:拣货,2:配送,3:取货
    role: 0,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 经纬度
    longitude: '',
    latitude: '',
    // 倒计时时长
    countdownnum: '90',
    // 图片路径为空时默认图路径
    errorImage: '/lib/images/errorImage.png',
    // 自定义抽奖图开关
    cent_istrunbg: 0,
    // 抽奖背景图
    cent_bgurl: '',
    // 抽奖转盘图
    cent_turnurl: '',
    // 抽奖按钮图
    cent_btnurl: '',
    // 门店列表
    shopList: [],
    // 搜索内容
    search_val: '',
    // 购物车数量
    cartCount: 0,
    // 收货地址(编辑订单用)
    address: '',
    // 地址id
    addressId: '',
    // 地址详情(编辑地址用)
    addressDetail: '',
    // 身份标识列表
    roleList: [
      {name: '顾客', role: 0},
      {name: '拣货', role: 1},
      {name: '配送', role: 2},
      {name: '取货', role: 3},
    ],
    // 订单状态列表
    statusList: [
      {name: '全部', type: 0, num: 0},
      {name: '待支付', type: 1, num: 0},
      {name: '待取送', type: 2, num: 0},
      {name: '待发货', type: 3, num: 0},
      {name: '已完成', type: 9, num: 0},
    ],
    // 投诉类别列表
    typeList: ['投诉建议', '商品建议', '我要投诉'],
    // 订单评价类型列表
    EtypeList: [
      {name: '全部', type: 0},
      {name: '好评', type: 1},
      {name: '中评', type: 2},
      {name: '差评', type: 3},
    ],
    // 结算订单类型，otc区分购物车与立即购买now:正常立即购买
    orderType: [
      {name: '购物车去结算', isotc: '', otc: '', orderType: ''},
      {name: '普通立即购买', isotc: '', otc: 'now', orderType: ''},
      {name: '拼团立即购买', isotc: 'otc', otc: 'group', orderType: ''},
      {name: '砍价立即购买', isotc: 'otc', otc: 'hack', orderType: ''},
      {name: '发起拼团购买', isotc: 'group', otc: 'group', orderType: 1},
      {name: '参与拼团购买', isotc: 'group', otc: 'group', orderType: 2},
      {name: '砍价成功购买', isotc: 'hack', otc: 'hack', orderType: 3},
      {name: '代金券立即购买', isotc: '', otc: 'voucher', orderType: 4},
      {name: '预售立即购买', isotc: '', otc: 'voucher', orderType: 5}
    ],
    // 扫码购店铺
    scanShopInfo: '',
    // 扫码购购物车
    scanCart: [],
    // 友链信息
    links: '',

    // 测试开发
    // 基础路径
    baseUrl: 'http://192.168.1.107:8089/eshop/',
    // baseUrl: 'https://www.91jyrj.com/shop/',
    // 商家code
    shopcode: '',
    // 商家图标
    shoplogo: '/lib/images/logo.jpg',
    // app首页图
    loadingimg: '/lib/images/loading.jpg',
    // 联系我们
    cantacts: 'https://www.91jyrj.com/eshop/upload/text/front/lianxinus.html',
    // app标题
    apptitle: '嘉元科技',
  },

  // 新版本校验
  checkUpdateVersion () {
    let self = this
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate( res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            toast.toast('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~')
          })
        }
      })
    } else {
      toast.toast('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  },

  // 是否授权
  authorFlag () {
    let self = this
    let openid = self.globalData.openid
    let defaultOpenid = self.globalData.defaultOpenid
    return openid !== defaultOpenid;
 },

  //  是否注册
  memcodeflag () {
    let self = this
    return self.globalData.memcode;
  },

  // 扫码购购物车操作,goods:商品信息;types:操作方法(add:加，count:减)
  setScanCart (goods, types) {
    let self = this
    // 是否新商品标识
    let flag = true
    let scanCart = self.globalData.scanCart
    scanCart.forEach(item => {
      if (item.barcode === goods.barcode) {
        flag = false
        if (types === 'add') {
          item.quantity++
        } else if (types === 'count') {
          if (item.quantity > 1) {
            item.quantity--
          }
        }
      }
    })
    if (flag) {
      scanCart.push(goods)
    }
  },
})
