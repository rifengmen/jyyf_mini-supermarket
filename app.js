// app.js
import toast from './utils/toast'

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
              success: res => {
                // 确认
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            toast('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~')
          })
        }
      })
    } else {
      toast('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  },

  // 全局变量
  globalData: {
    // 应用名称
    apptitle: '',
    // 当前线上版本号
    version: '',
    // openid
    openid: '',
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
    // 身份信息，0：顾客；1：配送员；2：团长
    role: '',
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
    // 图片路径为空时默认图路径
    defgoodsimg: '/lib/images/defgoodsimg.png',
    // 主题背景色
    home_bgcolor: '',
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
    // 订单详情
    orderDetail: '',
    // 收货地址(编辑订单用)
    address: '',
    // 地址id
    addressId: '',
    // 地址详情(编辑地址用)
    addressDetail: '',
    // 订单编号，用来处理订单取消返回，订单列表对应数据刷新
    ordernum: '',
    // 商品显示类型列表
    showTypeList: [
      {name: '一行一条商品       ', title: 'goods_item ', namefont: 'font28', pricefont: 'font30', delfont: 'font22', type: 0},
      {name: '一行一条商品（放大）', title: 'goods_item1', namefont: 'font32', pricefont: 'font36', delfont: 'font26', type: 1},
      {name: '一行两条商品       ', title: 'goods_item2', namefont: 'font32', pricefont: 'font36', delfont: 'font26', type: 2},
      {name: '一行三条商品       ', title: 'goods_item3', namefont: 'font24', pricefont: 'font30', delfont: 'font22', type: 3},
    ],
    // banner类型列表
    bannerTypeList: [
      {name: '首页banner', businessflag: 1, list: []},
      {name: '充值banner', businessflag: 2, list: []},
      {name: '海  报  区', businessflag: 3, list: []},
      {name: '视  频  区', businessflag: 4, list: []},
    ],
    // 各种类别商品轮播列表
    promotemodeList: [
      {label: '特价', name: '特价商品', promotemode: 999, list: []},
      {label: '拼团', name: '一起拼团', promotemode: 100, list: []},
      {label: '秒杀', name: '限时秒杀', promotemode: 101, list: []},
      {label: '砍价', name: '一砍到底', promotemode: 102, list: []},
      {label: '预售', name: '热品预售', promotemode: 103, list: []},
    ],
    // 结算订单类型，otc区分购物车与立即购买，now:正常立即购买
    orderTypeList: [
      {name: '购物车去结算', promotemode: 999, isotc: '', otc: '', orderType: ''},
      {name: '普通立即购买', promotemode: 999, isotc: '', otc: 'now', orderType: 2},
      {name: '拼团立即购买', promotemode: 100, isotc: 'otc', otc: 'group', orderType: 2},
      {name: '砍价立即购买', promotemode: 102, isotc: 'otc', otc: 'hack', orderType: 2},
      {name: '发起拼团购买', promotemode: 100, isotc: 'group', otc: 'group', orderType: 3},
      {name: '参与拼团购买', promotemode: 100, isotc: 'group', otc: 'group', orderType: 4},
      {name: '砍价成功购买', promotemode: 102, isotc: 'hack', otc: 'hack', orderType: 5},
      {name: '预售立即购买', promotemode: 103, isotc: '', otc: 'now', orderType: 6},
      {name: '秒杀立即购买', promotemode: 101, isotc: '', otc: 'now', orderType: 7},
      {name: '代金券的购买', promotemode: 999, isotc: '', otc: 'now', orderType: 999}
    ],
    // 身份标识列表
    roleList: [
      {name: '顾 客', role: 0, num: 0},
      {name: '配送员', role: 1, num: 0},
      {name: '团 长', role: 2, num: 0},
    ],
    // 订单状态列表
    statusList: [
      {name: '全 部', type: -2, num: 0},
      {name: '待支付', type: 1, num: 0},
      {name: '待中转', type: 2, num: 0},
      {name: '待收货', type: 3, num: 0},
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
    // 扫码购店铺
    scanShopInfo: '',
    // 扫码购购物车
    scanCart: [],
    // 友链详情
    friendLink: '',
    // 商品详情(海报分享用)
    goodsDetail: '',

    // 测试开发
    // 基础路径
    // baseUrl: 'http://192.168.1.107:8089/simple-eshop/',
    baseUrl: 'https://www.91jyrj.com/shop/',


    // // 金威快购 长治金威超市
    // baseUrl: 'http://www.jwkgou.com:8088/simple-eshop/', // 2.1.35版以前前路径
    // baseUrl: 'https://www.jwkgou.com:8443/simple-eshop/', // 2.1.35版路径

    // // 美廉美优选 牙克石美廉美超市
    // baseUrl: 'https://www.mlmcs2021.com:58443/eshop/',

    // // 田森优选 盂县田森超市
    // baseUrl: 'https://www.tianshenyouxuan.com:58443/eshop/',
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
              success: res => {
                // 确认
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            toast('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~')
          })
        }
      })
    } else {
      toast('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  },

  // 是否注册
  bindmobileFlag () {
    let self = this
    let memcode = (self.globalData.mobile).slice(0, 2)
    return memcode !== 'WX'
  },

  // 支付开通提醒
  coflagTip () {
    let self = this
    if (!self.globalData.coflag) {
      toast('您还未开通会员支付！请开通！')
    }
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

  // 16进制转rgb
  colorRgb (colors) {
    let self = this
    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 把颜色值变成小写
    let color = colors.toLowerCase()
    if (reg.test(color)) {
      // 如果只有三位的值，需变成六位，如：#fff => #ffffff
      if (color.length === 4) {
        let colorNew = "#"
        for (let i = 1; i < 4; i += 1) {
          colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
        }
        color = colorNew
      }
      // 处理六位的颜色值，转为RGB
      let colorChange = []
      for (let i = 1; i < 7; i += 2) {
        colorChange.push(parseInt("0x" + color.slice(i, i + 2)))
      }
      return colorChange.join(",")
    } else {
      return color
    }
  },

  // 去banner详情
  toBannerDetail (banner) {
    let self = this
    // let banner = e.currentTarget.dataset.banner
    let linktype = banner.linktype
    switch (linktype) {
      case 1:
        // 限时秒杀
        wx.navigateTo({
          url: '/shopping/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + '限时秒杀' + '&promotemode=101'
        })
        break
      case 2:
        // 轮播图(分类)
        wx.navigateTo({
          url: '/shopping/pages/goodsList/goodsList?Classcode=' + banner.linkcode + '&title=' + '商品列表'
        })
        break
      case 3:
        // 单分类/集群
        wx.navigateTo({
          url: '/shopping/pages/goodsList/goodsList?Cateid=' + banner.linkcode + '&title=' + '商品列表'
        })
        break
      case 4:
        // 公告详情
        wx.navigateTo({
          url: '/message/pages/detail/detail?id=' + banner.linkcode + '&type=notice',
        })
        break
      case 5:
        // 充值中心
        wx.navigateTo({
          url: '/autoModule/pages/recharge/recharge',
        })
        break
      case 6:
        // 积分抽奖
        wx.navigateTo({
          url: '/autoModule/pages/lottery/lottery',
        })
        break
      case 7:
        // 领券中心
        wx.navigateTo({
          url: '/autoModule/pages/tickList/tickList?from=auto',
        })
        break
      case 8:
        // 直播
        let roomid = banner.linkcode;
        // 存在直播间直接进房间，否则去直播间列表
        if (!roomid) {
          wx.navigateTo({
            url: '/pages/roomplayList/roomplayList',
          })
        } else {
          let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 }))
          wx.navigateTo({
            url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + roomid + "&custom_params=" + customParams
          })
        }
        break
      case 10:
        // 签到
        wx.navigateTo({
          url: '/autoModule/pages/signIn/signIn',
        })
        break
      default:
    }
  },
})
