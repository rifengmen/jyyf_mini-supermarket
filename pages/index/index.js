//index.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 搜索内容
    search_val: '',
    // 通知列表
    noticeList: [],
    // banner图 图片
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
    // 推荐商品列表
    recommendList: [],
    // 专区列表
    hotList: [],
    // 弹框组件显示开关
    dialogFlag: false,
    // 弹窗title
    dialogTitle: '',
    // 弹窗价格
    dialogPrice: '',
    // 弹窗斤
    dialogJin: '',
    // 弹窗两
    dialogLiang: '',
    // 弹窗重量
    dialogCount: '',
    // 弹窗合计金额
    dialogTotalMoney: '',
    // 商品信息
    goods: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 设置title
    wx.setNavigationBarTitle({
      title: app.globalData.apptitle
    })
    self.setData({
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode,
    })
    // 获取banner列表
    self.getBannerList()
    // 获取自定义功能列表
    self.getModulePictureList()
    // 获取公告列表
    self.getNoticeList()
    // 获取海报列表
    self.getPosterList()
    // 获取推荐商品列表
    self.getTheme()
    // 获取专区列表
    self.getHotList()
    // 更新购物车数量
    self.getCartCount()
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
     // 更新购物车数量
    self.getCartCount()
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
    request.http('system/slide.do?method=listShopHomeSlide', data).then(result => {
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
    self.setData({
      swiperCurrent: e.detail.current
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
    let day = date.getDate();
    let end = year.toString()+ month.toString() + day.toString();
    let data = {
      version: end
    }
    request.http('system/customlogin.do?method=getModulePictureList', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          modulePictureList: res.data.picturenamelist
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 前往自定义功能区
  toAutoCate (e) {
    let self = this;
    let moduletype = e.currentTarget.dataset.moduletype;
    if (moduletype) {
      switch (moduletype) {
        case 1:
          // 常购商品
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?Datatype=' + '4' + '&title=' + '常购商品',
          })
          break;
        case 2:
          // 电子会员
          wx.navigateTo({
            url: '/pages/userInfo/myCode/myCode',
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
            url: '/pages/userInfo/record/record',
          })
          break;
        case 5:
          // 会员特价
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?Datatype=' + '2' + '&title=' + '会员特价',
          })
          break;
        case 7:
          // 特价商品
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?Datatype=' + '1' + '&title=' + '特价商品',
          })
          break;
        case 8:
          // 投诉建议
          wx.navigateTo({
            url: '/pages/userInfo/complaintList/complaintList',
          })
          break;
        case 9:
          // 推荐商品
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?Datatype=' + '3' + '&title=' + '推荐商品',
          })
          break;
        case 10:
          // 我的订单
          wx.navigateTo({
            url: '/pages/userInfo/orderList/orderList',
          })
          break;
        case 11:
          // 我的积分
          wx.navigateTo({
            url: '/pages/userInfo/score/score',
          })
          break;
        case 12:
          // 直接录入
          break;
        case 13:
          // 周边看看
          wx.navigateTo({
            url: '/pages/autoModule/nearby/nearby',
          })
          break;
        case 14:
          // 抢购商品
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + '抢购商品'
          })
          break;
        case 15:
          // 领券中心
          wx.navigateTo({
            url: '/pages/tickList/tickList?from=auto',
          })
          break;
        case 16:
          // 购物评价
          wx.navigateTo({
            url: '/pages/autoModule/commentList/commentList?title=我的评价&from=auto',
          })
          break;
        case 17:
          // 我的余额
          wx.navigateTo({
            url: '/pages/userInfo/balance/balance',
          })
          break;
        case 18:
          // 我的优惠券
          wx.navigateTo({
            url: '/pages/tickList/tickList?from=userInfo',
          })
          break;
        case 19:
          // 积分抽奖
          wx.navigateTo({
            url: '/pages/autoModule/lottery/lottery',
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
    request.http('info/InformationController.do?method=listNotice', data).then(result => {
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
    request.http('system/slide.do?method=listShopHomeSlide1', data).then(result => {
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

  // 获取推荐商品列表
  getTheme () {
    let self = this
    let data = {}
    request.http('info/Category.do?method=getTheme', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.length) {
          self.setData({
            recommendList: res.data
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取专区列表
  getHotList () {
    let self = this
    let data = {}
    request.http('info/Category.do?method=listHot180414', data).then(result => {
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

  // 去banner详情
  toBannerDetail (e) {
    let self = this
    let id = e.currentTarget.dataset.id
    let data = {
      ImageID: id
    }
    request.http('system/slide.do?method=getLinkForSlide', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let linktype = res.data.linktype
        if (linktype === 1) { // 抢购商品
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + '抢购商品'
          })
        } else if (linktype === 2) { // 分类商品列表
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?classCode=' + res.data.linkcode + '&title=' + '商品列表'
          })
        } else if (linktype === 3) { // 商品列表
          wx.navigateTo({
            url: '/pages/goodsList/goodsList?cateid=' + res.data.linkcode + '&title=' + '商品列表'
          })
        } else if (linktype === 4) { // 公告详情
          wx.navigateTo({
            url: '/pages/message/noticeDetail/noticeDetail?id=' + res.data.linkcode,
          })
        } else if (linktype === 5) { // 充值中心
          wx.navigateTo({
            url: '/pages/autoModule/recharge/recharge',
          })
        } else if (linktype === 6) { // 积分抽奖
          wx.navigateTo({
            url: '/pages/autoModule/lottery/lottery',
          })
        } else if (linktype === 7) { // 领券中心
          wx.navigateTo({
            url: '/pages/tickList/tickList?from=auto',
          })
        } else if (linktype === 8) { // 直播
          let roomid = res.data.linkcode;
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
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 添加购物车
  addCart (e) {
    let self = this
    // 获取添加购物车组件
    let addcart = self.selectComponent('#addCart')
    let goods = e.currentTarget.dataset.goods
    // 判断是否散称
    if (goods.scaleflag) {
      self.setData({
        dialogFlag: true,
        dialogTitle: goods.Name,
        dialogPrice: goods.Highpprice,
        goods: goods,
      })
    } else {
      // 调用子组件，传入商品信息添加购物车
      addcart.addCart(goods)
    }
  },

  // 弹窗关闭
  dialogClose () {
    let self = this
    self.setData({
      dialogFlag: false,
      dialogJin: '',
      dialogLiang: '',
      dialogCount: '',
      dialogTotalMoney: '',
    })
  },

  // 弹窗确认
  dialogConfirm () {
    let self = this
    // 获取添加购物车组件
    let addcart = self.selectComponent('#addCart')
    let goods = self.data.goods
    goods.count = self.data.dialogCount
    // 调用子组件，传入商品信息添加购物车
    addcart.addCart(goods)
    self.dialogClose()
  },

  // 设置弹窗斤
  setDialogJin (e) {
    let self = this
    self.setData({
      dialogJin: e.detail.value
    })
    // 设置弹窗重量
    self.setDialogCount()
    // 设置弹窗金额
    self.setDialogTotalMoney()
  },

  // 设置弹窗两
  setDialogLiang (e) {
    let self = this
    self.setData({
      dialogLiang: e.detail.value
    })
    // 设置弹窗重量
    self.setDialogCount()
    // 设置弹窗金额
    self.setDialogTotalMoney()
  },

  // 设置弹窗重量
  setDialogCount () {
    let self = this
    self.setData({
      dialogCount: (self.data.dialogJin/2 + self.data.dialogLiang/20).toFixed(2)
    })
  },

  // 设置弹窗金额
  setDialogTotalMoney () {
    let self = this
    self.setData({
      dialogTotalMoney: (self.data.dialogPrice * self.data.dialogCount).toFixed(2)
    })
  },

  // 更新购物车数量
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
