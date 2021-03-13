//index.js
const app = getApp()
const toast = require("../../utils/toast")
import API from '../../api/index'

Page({
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 等待动画开关
    loadingFlag: false,
    // openid
    openid: '',
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 默认门店名称
    defaultDeptname: '',
    // 默认门店code
    defaultDeptcode: '',
    // 请求开关
    getFlag: false,
    // 搜索内容
    search_val: '',
    // 通知列表
    noticeList: [],
    // banner类型列表
    bannerTypeList: app.globalData.bannerTypeList,
    // 轮播点儿下标
    swiperCurrent_banner: 0,
    swiperCurrent_module: 0,
    swiperCurrent_friend: 0,
    // 自定义模块列表
    modulePictureList: [],
    // 友链列表
    friendLinkList: [],
    // 视频广告列表
    advideoList: [
      {url: 'https://vd4.bdstatic.com/mda-kitkpymkcp9yqnq3/sc/mda-kitkpymkcp9yqnq3.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D&v_from_s=tc_videoui_4135&auth_key=1614913046-0-0-ad552e0f3e7fd577495efed051d87c9e&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=8_2'},
      {url: 'https://vd2.bdstatic.com/mda-mc3zhgxb0pzn62zb/v1-cae/sc/mda-mc3zhgxb0pzn62zb.mp4?v_from_s=tc_haokanvideoui_5488&auth_key=1614913460-0-0-680133311ef4ab5a3ab1a4aaca45d0b7&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=8_2'},
      {url: 'https://vd2.bdstatic.com/mda-mc4cvdgiqwb35kd7/fhd/cae_h264_nowatermark/1614907296/mda-mc4cvdgiqwb35kd7.mp4?v_from_s=tc_haokanvideoui_5488&auth_key=1614913494-0-0-877f7e7709e22cb23cb05c3318d7a413&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=8_2'},
    ],
    // 推荐商品列表
    recommendList: [],
    // indexHotList
    indexHotList: [],
    // 专区列表
    hotList: [],
    // 各种类别商品轮播列表
    promotemodeList: app.globalData.promotemodeList,
    // 导航栏前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
    frontColor: '#ffffff',
    // 主题背景图
    home_bgurl: '',
    // 主题背景色
    home_bgcolor: '#71d793',
    // 秒杀/特价背景色
    home_promotebg: '#f68e74',
    // 弹框组件显示开关
    dialogFlag: false,
    // 广告弹框显示开关
    addialogFlag: true,
    // 商品信息
    goods: '',
    // 投诉类别列表
    typeList: app.globalData.typeList,
    // 分享门店名称
    shareDeptname: '',
    // 分享门店code
    shareDeptcode: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let deptname = options.deptname || ''
    let deptcode = options.deptcode || ''
    // 获取当前线上版本号
    self.getVersion()
    // 获取店铺基础设置信息配置首页
    self.getShopOptions()
    // 新版本校验
    app.checkUpdateVersion()
    if (deptname && deptcode) {
      self.setData({
        loadingFlag: false,
        deptname: deptname,
        deptcode: deptcode,
      })
      app.globalData.deptname = deptname
      app.globalData.deptcode = deptcode
      // 初始化
      self.init()
    }
    // 查看授权，authSetting授权列表，scope.userInfo：openid授权，
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          self.getCode()
        } else {
          // 没有门店
          if (!deptname && !deptcode) {
            // 获取定位
            self.getLocation()
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    self.animation = animation
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
    let openid = app.globalData.openid
    if (openid) {
      // 更新购物车数量
      self.getCartCount()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    // 弹窗关闭
    self.dialogClose()
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
    let self = this
    // 初始化
    self.init()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
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
    let self = this
    return {
      title: app.globalData.apptitle,
      path: '/pages/index/index?deptname=' + self.data.deptname + '&deptcode=' + self.data.deptcode
    }
  },

  // 获取当前线上版本号
  getVersion () {
    let self = this
    let accountInfo = wx.getAccountInfoSync()
    // 当前线上版本号
    app.globalData.version = accountInfo.miniProgram.version
    console.log(accountInfo, 'accountInfo')
  },

  // 获取店铺基础设置信息配置首页
  getShopOptions () {
    let self = this
    let data = {}
    API.system.getTheme(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          home_bgurl: res.data.home_bgurl || '',
          home_bgcolor: app.colorRgb(res.data.home_bgcolor || '#71d793'),
          home_promotebg: res.data.home_promotebg || '#f68e74',
        })
        app.globalData.home_bgcolor = res.data.home_bgcolor
        app.globalData.cent_istrunbg = res.data.cent_istrunbg
        app.globalData.cent_bgurl = res.data.cent_bgurl
        app.globalData.cent_turnurl = res.data.cent_turnurl
        app.globalData.cent_btnurl = res.data.cent_btnurl
        app.globalData.moneyType = res.data.moneyType
        // 设置title
        wx.setNavigationBarTitle({
          title: app.globalData.apptitle
        })
        // 设置主题背景色
        wx.setNavigationBarColor({
          frontColor: self.data.frontColor,
          backgroundColor: res.data.home_bgcolor || '#71d793',
        })
        // // 设置tabbar选中字体颜色
        // wx.setTabBarStyle({
        //   selectedColor: res.data.home_bgcolor || '#71d793',
        // })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取code
  getCode () {
    let self = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          self.setData({
            code: res.code
          })
          // 获取用户头像
          wx.getUserInfo({
            success: res => {
              app.globalData.userImg = res.userInfo.avatarUrl
            }
          })
          // 获取openid
          self.getOpenID()
        } else {
          toast.toast('登录失败！' + res.errMsg)
        }
      }
    })
  },

  // 获取openid
  getOpenID () {
    let self = this
    let data = {
      code: self.data.code
    }
    API.system.getOpenID(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          openid: res.data.openid,
          hasUserInfo: true
        })
        app.globalData.openid = res.data.openid
        // 获取用户信息
        self.login()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
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
          toast.toast('当前帐号类型不正确,不可使用')
          return
        }
        app.globalData.userid = userid
        app.globalData.mobile = mobile
        app.globalData.memname = memname
        app.globalData.memcode = memcode
        app.globalData.role = role
        app.globalData.coflag = coflag
        // 默认门店标志
        let isdefaultdept = res.data.isDefaultDept
        let defaultDeptname = res.data.shopInfo.shopname
        let defaultDeptcode = res.data.shopInfo.shopcode
        let deptname = self.data.deptname
        let deptcode = self.data.deptcode
        // 没有门店
        if (!deptname && !deptcode) {
          if (isdefaultdept) { // 存在默认门店
            self.setData({
              deptname: defaultDeptname,
              deptcode: defaultDeptcode,
            })
            app.globalData.deptname = defaultDeptname
            app.globalData.deptcode = defaultDeptcode
            // 初始化
            self.init()
          } else { // 不存在默认门店
            // 获取定位
            self.getLocation()
          }
        }
        // 更新购物车数量
        self.getCartCount()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取定位
  getLocation () {
    let self = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success (res) {
        app.globalData.longitude = res.longitude
        app.globalData.latitude = res.latitude
      },
      // 接口调用结束
      complete () {
        // 获取门店列表
        self.getShopList()
      }
    })
  },

  // 获取门店列表
  getShopList () {
    let self = this
    let longitude = app.globalData.longitude || 0
    let latitude = app.globalData.latitude || 0
    let data = {
      Longitude: longitude,
      Latitude: latitude,
      deptType: 1
    }
    API.system.listDeptInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 设置当前门店为最近门店
        let shopList = res.data
        app.globalData.shopList = shopList
        if (shopList.length === 1) {
          let deptname = shopList[0].deptname
          let deptcode = shopList[0].deptcode
          self.setData({
            deptname: deptname,
            deptcode: deptcode
          })
          app.globalData.deptname = deptname
          app.globalData.deptcode = deptcode
          // 初始化
          self.init()
        } else {
          wx.reLaunch({
            url: '/pages/shopList/shopList'
          })
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 初始化
  init () {
    let self = this
    // 发送各种banner类型请求
    self.sendBusinessflag()
    // 获取自定义功能列表
    self.getModulePictureList()
    // 获取公告列表
    self.getNoticeList()
    // 获取友链列表
    self.getFriendLinkList()
    // 获取推荐商品列表
    self.getTheme()
    // 获取专区列表
    self.getHotList()
    // 各种类别商品轮播列表
    self.data.promotemodeList.forEach(item => {
      if (item.promotemode !== 999) {
        // 获取各种类别商品轮播列表
        self.getProductListByPromote(item)
      }
    })
    // 获取特价商品列表
    self.getProductList()
  },

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove (res) {
    return false
  },

  // 发送各种banner类型请求
  sendBusinessflag () {
    let self = this
    let bannerTypeList = self.data.bannerTypeList
    let data = {}
    bannerTypeList.forEach(item => {
      data = {
        businessflag: item.businessflag,
      }
      // 获取各种banner图列表
      self.getBannerList (data)
    })
  },

  // 获取各种banner图列表
  getBannerList (data) {
    let self = this
    API.system.listShopHomeSlide(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let bannerTypeList = self.data.bannerTypeList
        bannerTypeList.forEach(item => {
          if (item.businessflag === data.businessflag) {
            item.list = res.data
          }
        })
        self.setData({
          bannerTypeList: bannerTypeList,
        })
        app.globalData.bannerTypeList = bannerTypeList
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 修改轮播点儿
  swiperChange (e) {
    let self = this
    let {swiper} = e.currentTarget.dataset
    let {source, current} = e.detail
    if (source === 'autoplay' || source === 'touch') {
      if (swiper === 'banner') {
        self.setData({
          swiperCurrent_banner: current
        })
      } else if (swiper === 'module') {
        self.setData({
          swiperCurrent_module: current
        })
      } else if (swiper === 'friend') {
        self.setData({
          swiperCurrent_friend: current
        })
      }
    }
  },

  // 去banner详情
  toBannerDetail (e) {
    let self = this
    let banner = e.currentTarget.dataset.banner
    let linktype = banner.linktype
    banner.linkcode = banner.objectcode
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
      default:
    }
  },

  // 获取公告列表
  getNoticeList () {
    let self = this
    let data = {
      Listtype: 2
    }
    API.info.listNotice(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          noticeList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取自定义功能列表
  getModulePictureList () {
    let self = this
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    if(month.length === 1){
      month = '0' + month;
    }
    let day = date.getDate().toString()
    if (day.length === 1) {
      day = '0' + day
    }
    let end = year.toString()+ month.toString() + day.toString();
    let data = {
      version: end
    }
    API.system.getModulePictureList(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data) {
          let modulePictureList = res.data.picturenamelist
          let arr1_startindex = 0
          let arr1_endindex = 5
          let arr2_startindex = 0
          let arr2_endindex = 2
          let arr1 = []
          let arr2 = []
          modulePictureList.forEach(item => {
            if (modulePictureList.length > arr1_startindex) {
              arr1.push(modulePictureList.slice(arr1_startindex, arr1_startindex += arr1_endindex))
            }
          })
          arr1.forEach(item => {
            if (arr1.length > arr2_startindex) {
              arr2.push(arr1.slice(arr2_startindex, arr2_startindex += arr2_endindex))
            }
          })
          self.setData({
            modulePictureList: arr2
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 前往自定义功能区
  toAutoModuleDetail (e) {
    let self = this;
    let automodule = e.currentTarget.dataset.automodule
    let moduletype = automodule.moduletype
    if (moduletype) {
      switch (moduletype) {
        case 2:
          // 电子会员
          wx.navigateTo({
            url: '/userInfo/pages/myCode/myCode',
          })
          break;
        case 3:
          // 分类选品
          wx.switchTab({
            url: '/pages/category/category',
          })
          break;
        case 4:
          // 购买记录
          wx.navigateTo({
            url: '/userInfo/pages/recordList/recordList',
          })
          break;
        case 6:
          // 扫码购
          wx.navigateTo({
            url: '/scan/pages/scan/scan',
          })
          break;
        case 8:
          // 商品建议
            let typeList = self.data.typeList
            let type = 1
          wx.navigateTo({
            url: '/userInfo/pages/complaintList/complaintList?type=' + type + '&title=' + typeList[type],
          })
          break;
        case 10:
          // 我的订单
          wx.navigateTo({
            url: '/userInfo/pages/orderList/orderList',
          })
          break;
        case 11:
          // 我的积分
          wx.navigateTo({
            url: '/userInfo/pages/score/score',
          })
          break;
        // case 12:
        //   // 直接录入
        //   break;

        // case 13:
        //   // 周边看看
        //   wx.navigateTo({
        //     url: '/autoModule/pages/nearby/nearby',
        //   })
        //   break;
        case 15:
          // 领券中心
          wx.navigateTo({
            url: '/autoModule/pages/tickList/tickList?from=auto',
          })
          break;
        case 16:
          // 购物评价
          wx.navigateTo({
            url: '/autoModule/pages/buyGoodsList/buyGoodsList',
          })
          break;
        case 17:
          // 我的余额
          wx.navigateTo({
            url: '/userInfo/pages/balance/balance',
          })
          break;
        case 18:
          // 我的电子券
          wx.navigateTo({
            url: '/autoModule/pages/tickList/tickList?from=userInfo',
          })
          break;
        case 19:
          // 积分抽奖
          wx.navigateTo({
            url: '/autoModule/pages/lottery/lottery',
          })
          break;
        case 20:
          // 在线充值
          wx.navigateTo({
            url: '/autoModule/pages/recharge/recharge',
          })
          break;
        case 14:
          // 限时秒杀
          wx.navigateTo({
            url: '/shopping/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + automodule.modulename + '&promotemode=101'
          })
          break;
        case 7:
          // 特价商品
          wx.navigateTo({
            url: '/shopping/pages/goodsList/goodsList?Datatype=' + '1' + '&title=' + automodule.modulename,
          })
          break;
        case 5:
          // 会员特价
          wx.navigateTo({
            url: '/shopping/pages/goodsList/goodsList?Datatype=' + '2' + '&title=' + automodule.modulename,
          })
          break;
        case 9:
          // 推荐商品
          wx.navigateTo({
            url: '/shopping/pages/goodsList/goodsList?Datatype=' + '3' + '&title=' + automodule.modulename,
          })
          break;
        // case 1:
        //   // 常购商品
        //   wx.navigateTo({
        //     url: '/shopping/pages/goodsList/goodsList?Datatype=' + '4' + '&title=' + automodule.modulename,
        //   })
        //   break;
        case 21:
          // 门店优选（多分类）
          wx.navigateTo({
            url: '/shopping/pages/goodsList/goodsList?Datatype=' + '6' + '&title=' + automodule.modulename + '&Classid=' + automodule.Classid,
          })
          break;
        case 22:
          // 单分类/集群
          wx.navigateTo({
            url: '/shopping/pages/goodsList/goodsList?Cateid=' + automodule.Classid + '&title=' + automodule.modulename
          })
          break;
        default:
      }
    }
  },

  // 获取专区列表
  getHotList () {
    let self = this
    let data = {}
    API.info.listHot180414(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let hotList = res.data
        hotList.forEach((item, index) => {
          if (hotList.length % 2 === 1) {
            if (index === hotList.length - 1) {
              item.lastItem = 1
            } else {
              item.lastItem = 0
            }
          } else {
            if ((index === hotList.length - 1) || (index === hotList.length - 2)) {
              item.lastItem = 1
            } else {
              item.lastItem = 0
            }
          }
        })
        self.setData({
          hotList: hotList,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取各种类别商品轮播列表
  getProductListByPromote (promotemode) {
    let self = this
    let data = {
      promotemode: promotemode.promotemode,
      Page: 1,
      pageSize: 15,
    }
    API.info.getProductListByPromote(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let goodsList = {
          promotemode: promotemode.promotemode,
          list: res.data,
        }
        // 设置各种类别商品轮播列表
        self.setPromotemodeList(goodsList)
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取特价商品列表
  getProductList () {
    let self = this
    let data = {
      Datatype: '1',
      Page: 1,
      pageSize: 15,
      Sortflg: 1,
      sorttype: 0
    }
    API.info.getProductList(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 商品code统一字段
        let list = res.data
        list.forEach(item => {
          if (item.goodscode && !item.Gdscode) {
            item.Gdscode = item.goodscode
          }
        })
        // 设置各种类别商品轮播列表
        let promotemodeList = self.data.promotemodeList
        promotemodeList.forEach(item => {
          if (item.promotemode === 999) {
            item.list = list
          }
        })
        self.setData({
          promotemodeList: promotemodeList
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置各种类别商品轮播列表
  setPromotemodeList (goodsList) {
    let self = this
    let promotemodeList = self.data.promotemodeList
    promotemodeList.forEach(item => {
      if (item.promotemode === goodsList.promotemode) {
        item.list = goodsList.list
      }
    })
    self.setData({
      promotemodeList: promotemodeList,
    })
  },

  // 获取友链列表
  getFriendLinkList () {
    let self = this
    let data = {}
    API.system.getFriendLinks(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          friendLinkList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 去友链详情
  toLinkDetail(e) {
    let self = this
    let friendLink = e.currentTarget.dataset.friendlink
    let sitetype = friendLink.sitetype
    switch (sitetype) {
      // 跳转小程序
      case 1:
        wx.navigateToMiniProgram({
          appId: friendLink.appId,
          path: friendLink.sitedescribe,
          extraData: '',
          envVersion: '',
          success(res) {},
          fail (res) {},
        })
        break
      // 跳转H5
      case 2:
        app.globalData.friendLink = friendLink
        wx.navigateTo({
          url: '/friendLink/pages/h5/h5'
        })
        break
      // // 跳转App
      // case 3:
      //   app.globalData.friendLink = friendLink
      //   wx.navigateTo({
      //     url: '/links/pages/app/app'
      //   })
      //   break
      // 其他（做为副banner）
      case 4:
        break
      default:
    }
  },

  // 获取推荐商品列表(集群)
  getTheme () {
    let self = this
    let data = {}
    if (self.data.loadingFlag) {
      wx.showLoading({
        title: '正在加载',
        mask: true,
      })
    }
    API.info.getTheme(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.length) {
          let recommendList = res.data
          self.setData({
            recommendList: recommendList.filter(item => item.showway !== 3),
            indexHotList: recommendList.filter(item => item.showway === 3),
          })
        }
      } else {
        toast.toast(res.message)
      }
      if (self.data.loadingFlag) {
        wx.hideLoading()
      }
      // 关闭等待动画
      self.setData({
        loadingFlag: true
      })
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 添加购物车
  addCart (e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    // 调用数量/重量弹窗
    self.setData({
      dialogFlag: true,
      goods: goods,
    })
  },

  // 调用子组件添加购物车方法
  componentAddCart (goods) {
    let self = this
    let addcart = self.selectComponent('#addCart')
    // 调用子组件，传入商品信息添加购物车
    addcart.addCart(goods)
  },

  // 弹窗关闭
  dialogClose () {
    let self = this
    self.setData({
      dialogFlag: false,
      goods: '',
    })
  },

  // 弹窗确认
  dialogConfirm (goods) {
    let self = this
    // 调用子组件添加购物车方法
    self.componentAddCart(goods.detail)
    self.dialogClose()
  },

  // 设置广告弹窗开关
  setAddialogFlag () {
    let self = this
    self.setData({
      addialogFlag: !self.data.addialogFlag
    })
  },

  // 更新购物车数量
  getCartCount () {
    let self = this
    let data = {}
    API.bill.getCarProductCount(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let index = 2
        if (res.data) {
          if (res.data.data) {
            wx.setTabBarBadge({
              index: index,
              text: (res.data.data).toString()
            })
          } else {
            wx.removeTabBarBadge({
              index: index
            })
          }
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
