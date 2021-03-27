//index.js
const app = getApp()
import toast from '../../utils/toast'
import utils from '../../utils/util'
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
    // 自定义模块列表
    modulePictureList: [],
    // 友链列表
    friendLinkList: [],
    // 推荐商品列表
    clusterList: [],
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
    // 加购物车弹框显示开关
    dialogFlag: false,
    // 弹框广告显示开关
    addialogFlag: false,
    // 弹窗广告图
    adDialogImg: '',
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
    // 获取code
    self.getCode()
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
    // 校验是否首次登陆，非首次登录才更新购物车数量
    if (self.data.openid) {
      // 更新购物车数量
      self.getCartCount()
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
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
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
          // 获取openid
          self.getOpenID()
        } else {
          toast('登录失败！' + res.errMsg)
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
          hasUserInfo: true,
        })
        app.globalData.openid = res.data.openid
        // 获取用户信息
        self.login()
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
          toast('当前帐号类型不正确,不可使用')
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
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
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
      toast(error.error)
    })
  },

  // 初始化
  init () {
    let self = this
    let bannerTypeList = self.data.bannerTypeList
    let promotemodeList = self.data.promotemodeList
    // 清空list
    bannerTypeList.forEach(item => item.list = [])
    // 清空list
    promotemodeList.forEach(item => item.list = [])
    // 获取各种banner图列表
    self.getBannerList()
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
    // 获取特价商品轮播列表
    self.getProductList()
    // 获取各种类别商品轮播列表
    self.getProductListByPromote()
    // 获取弹窗广告图
    self.getAdDialogImg()
  },

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove () {
    return false
  },

  // 获取各种banner图列表
  getBannerList () {
    let self = this
    let data = {
      businessflag: 0,
    }
    API.system.listShopHomeSlide(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let bannerList = res.data
        let bannerTypeList = self.data.bannerTypeList
        bannerList.forEach(item => {
          item.linkcode = item.objectcode
          bannerTypeList[item.businessflag - 1].list.push(item)
        })
        self.setData({
          bannerTypeList: bannerTypeList,
        })
        app.globalData.bannerTypeList = bannerTypeList
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 去banner详情
  toBannerDetail (e) {
    let self = this
    let banner = e.currentTarget.dataset.banner
    app.toBannerDetail(banner)
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
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取自定义功能列表
  getModulePictureList () {
    let self = this
    let date = utils.formatDate(new Date()).split('/').join('')
    let data = {
      version: date
    }
    API.system.getModulePictureList(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data) {
          let modulePictureList = res.data.picturenamelist
          let list_startindex = 0
          let list_endindex = 10
          let list = []
          modulePictureList.forEach(item => {
            if (modulePictureList.length > list_startindex) {
              list.push(modulePictureList.slice(list_startindex, list_startindex += list_endindex))
            }
          })
          self.setData({
            modulePictureList: list
          })
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
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
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取各种类别商品轮播列表
  getProductListByPromote () {
    let self = this
    let data = {
      promotemode: 0,
      Page: 1,
      pageSize: 15,
    }
    API.info.getProductListByPromote(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let goodsList = res.data
        let promotemodeList = self.data.promotemodeList
        goodsList.forEach(item => {
          promotemodeList.forEach(modeitem => {
            if (item.promotemode === modeitem.promotemode) {
              modeitem.list.push(item)
            }
          })
        })
        self.setData({
          promotemodeList: promotemodeList,
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取特价商品轮播列表
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
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取友链列表
  getFriendLinkList () {
    let self = this
    let data = {}
    API.system.getFriendLinks(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let friendLinkList = res.data
        friendLinkList.forEach(item => item.Imageurl = item.siteurl)
        self.setData({
          friendLinkList: res.data
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
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
          let clusterList = res.data
          self.setData({
            clusterList: clusterList.filter(item => item.showway !== 3),
            indexHotList: clusterList.filter(item => item.showway === 3),
          })
        }
      } else {
        toast(res.message)
      }
      if (self.data.loadingFlag) {
        wx.hideLoading()
      }
      // 关闭等待动画
      self.setData({
        loadingFlag: true
      })
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取弹窗广告图
  getAdDialogImg () {
    let self = this
    let adDialogImg = self.data.adDialogImg
    let data = {}
    // 检验是否首次登录，首次登录请求弹框广告并显示
    if (adDialogImg) {
      return false
    }
    API.system.getHomeAds(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.length) {
          self.setData({
            adDialogImg: res.data[0]
          })
          // 设置弹框广告开关
          self.setAddialogFlag()
        }
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置弹框广告开关
  setAddialogFlag () {
    let self = this
    self.setData({
      addialogFlag: !self.data.addialogFlag,
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
      toast(error.error)
    })
  },
})
