//index.js
const app = getApp()
const toast = require("../../utils/toast")
import API from '../../api/index'

Page({
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    errorImage: app.globalData.errorImage,
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
    // banner图 图片列表
    bannerList: [],
    // 轮播点儿下标
    swiperCurrent: 0,
    // 海报列表
    posterList: [],
    // 自定义模块列表
    modulePictureList: [],
    lefOrRigOne: true,
    leftTwo: '383rpx',
    flag: true,
    animationData: {},
    // 友链列表
    linkList: [],
    // 推荐商品列表
    recommendList: [],
    // indexHotList
    indexHotList: [],
    // 专区列表
    hotList: [],
    // 秒杀商品列表
    panicBuyGoodsList: [],
    // 特价商品列表
    specialGoodsList: [],
    // 导航栏前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
    frontColor: '#ffffff',
    // 首页背景图
    home_bgurl: '',
    // 首页背景色
    home_bgcolor: '#71d793',
    // 秒杀/特价背景色
    home_promotebg: '#f68e74',
    // 弹框组件显示开关
    dialogFlag: false,
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
    app.globalData.version = accountInfo.version
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
          home_bgcolor: res.data.home_bgcolor || '#71d793',
          home_promotebg: res.data.home_promotebg || '#f68e74',
        })
        app.globalData.cent_istrunbg = res.data.cent_istrunbg
        app.globalData.cent_bgurl = res.data.cent_bgurl
        app.globalData.cent_turnurl = res.data.cent_turnurl
        app.globalData.cent_btnurl = res.data.cent_btnurl
        app.globalData.moneyType = res.data.moneyType
        // 设置title
        wx.setNavigationBarTitle({
          title: app.globalData.apptitle
        })
        // 设置背景色
        wx.setNavigationBarColor({
          frontColor: self.data.frontColor,
          backgroundColor: self.data.home_bgcolor,
        })
      } else {
        toast.toast(res.message)
      }
      // 关闭等待动画
      self.setData({
        loadingFlag: true
      })
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
    // 获取banner列表
    self.getBannerList()
    // 获取自定义功能列表
    self.getModulePictureList()
    // 获取公告列表
    self.getNoticeList()
    // 获取友链列表
    self.getLinkList()
    // 获取海报列表
    self.getPosterList()
    // 获取推荐商品列表
    self.getTheme()
    // 获取专区列表
    self.getHotList()
    // 获取秒杀商品列表
    self.getPanicBuyGoodsList()
    // 获取特价商品列表
    self.getSpecialGoodsList()
  },

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove (res) {
    return false
  },

  // 获取banner图列表
  getBannerList () {
    let self = this
    let data = {
      // 卡冲值参数为1，其它是0
      cardflag: 0
    }
    API.system.listShopHomeSlide(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          bannerList: res.data
        })
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
    if (e.detail.source === 'autoplay' || e.detail.source === 'touch') {
      self.setData({
        swiperCurrent: e.detail.current
      })
    }
  },


  // 获取banner详情
  getBannerDetail (e) {
    let self = this
    let id = e.currentTarget.dataset.id
    let data = {
      ImageID: id
    }
    API.system.getLinkForSlide(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 去banner详情
        self.toBannerDetail(res.data)
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 去banner详情
  toBannerDetail (banner) {
    let self = this
    let linktype = banner.linktype
    switch (linktype) {
      case 1:
        // 限时秒杀
        wx.navigateTo({
          url: '/shopping/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + '限时秒杀'
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
          let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/login/login', pid: 1 }))
          wx.navigateTo({
            url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + roomid + "&custom_params=${customParams}"
          })
        }
        break
      default:
    }
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
          self.setData({
            modulePictureList: res.data.picturenamelist
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
            url: '/shopping/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + automodule.modulename
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

  // 自定义区滚动条
  conScroll (e) {
    let self = this
    var len = self.data.modulePictureList.length; // len为多少列
    var screenLen = wx.getSystemInfoSync().windowWidth; // 屏幕宽度 单位px
    var conLenR = len * 148; // 148为内容滚动区每一列的宽度 单位rpx
    var conLenP = screenLen / 750 * conLenR; // 计算内容滚动区的像素长度（小程序规定屏幕宽度为750rpx）
    var scrollLen = conLenP - screenLen; // 计算滚动轴需要滚动的距离 单位px
    var addLen;
    if (self.data.flag) {
      // 40为红色线条的长度rpx  28为红色和灰色线条的空白区域8rpx 加上 灰色线条的长度20rpx
      addLen = 40 + e.detail.scrollLeft / scrollLen * 28 + 'rpx'
    }else{
      addLen = 40 + (scrollLen - e.detail.scrollLeft) / scrollLen * 28 + 'rpx'
    }
    self.animation.width(addLen).step();
    self.setData({
      animationData: self.animation.export(),
    })
  },
  conScrLower (e) {
    let self = this
    self.animation.width('40rpx').step();
    self.setData({
      lefOrRigOne: false,
      leftTwo: '335rpx',
      animationData: self.animation.export(),
      flag: false
    })
  },
  conScrUpper (e) {
    let self = this
    self.animation.width('40rpx').step();
    self.setData({
      lefOrRigOne: true,
      leftTwo: '383rpx',
      animationData: self.animation.export(),
      flag: true
    })
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

  // 获取海报列表
  getPosterList () {
    let self = this
    let data = {
      // 卡冲值参数为1，其它是0
      cardflag: 0
    }
    API.system.listShopHomeSlide1(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          posterList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取推荐商品列表(集群)
  getTheme () {
    let self = this
    let data = {}
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
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
      wx.hideLoading()
      // 设置请求开关
      self.setData({
        getFlag: true
      })
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取专区列表
  getHotList () {
    let self = this
    let data = {}
    API.info.listHot180414(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          hotList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取秒杀商品列表
  getPanicBuyGoodsList () {
    let self = this
    let data = {}
    API.info.getProductListByPromote(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          panicBuyGoodsList: res.data,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取特价商品列表
  getSpecialGoodsList () {
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
        self.setData({
          specialGoodsList: res.data,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取友链列表
  getLinkList () {
    let self = this
    let data = {
      // 卡冲值参数为1，其它是0
      cardflag: 0
    }
    API.system.listShopHomeSlide(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          linkList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取友链详情
  getLinkDetail (e) {
    let self = this
    let id = e.currentTarget.dataset.id
    let data = {
      ImageID: id
    }
    API.system.getLinkForSlide(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 去友链详情
        self.toLinkDetail(res.data)
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 去友链详情
  toLinkDetail(link) {
    let self = this
    let linktype = link.linktype
    // links = {
    //   // 名称
    //   title: '嘉元app',
    //   // 小程序appId
    //   appId: '',
    //   // 路径(app中转页图片、小程序进入路径、h5的url)
    //   url: 'upload/shopslide/001.png',
    //   // 传递的数据
    //   cont: {},
    // }
    let links = link.data
    app.globalData.links = links
    switch (linktype) {
        // 跳转小程序
      case 1:
        wx.navigateToMiniProgram({
          appId: 'wxfdc96a33462b1e54',
          path: '/pages/login/login',
          extraData: '',
          envVersion: '',
          success(res) {},
          fail (res) {},
        })
        break
      // 跳转H5
      case 2:
        app.globalData.links = {
          // 名称
          title: '嘉元微会员',
          // 小程序appId
          appId: 'wx700e813e33fcebec',
          // 路径(app中转页图片、小程序进入路径、h5的url)
          url: 'https://member.spzlk.cn/supermarket/?dianpu=2',
          // 传递的数据
          cont: {},
        }
        wx.navigateTo({
          url: '/links/pages/h5/h5'
        })
        break
        // 跳转App
      case 3:
        wx.navigateTo({
          url: '/links/pages/app/app'
        })
        break
      default:
    }
  },

  // 添加购物车
  addCart (e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    // 判断是否散称
    if (goods.scaleflag) {
      self.setData({
        dialogFlag: true,
        goods: goods,
      })
    } else {
      // 调用子组件添加购物车方法
      self.componentAddCart(goods)
    }
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
