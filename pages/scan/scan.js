// pages/scan/scan.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 经纬度
    longitude: '',
    latitude: '',
    // scanShopInfo 店铺信息
    scanShopInfo: '',
    // shopIndex 选中店铺下标
    shopIndex: 0,
    // 店铺列表
    scanShopList: [],
    // scanCart 购物车
    scanCart: [],
    // 扫码购类型，0：共用线上购物车；1：本地独立购物车
    scanType: app.globalData.scanType,
    // 0：共用线上购物车需要的参数
    // 店铺名称
    deptname: '',
    // 店铺编号
    deptcode: '',
    // 商品条码
    goodscode: '',
    // 商品信息
    goodsInfo: '',
    // 商品信息弹窗开关
    goodsInfoFlag: false,
    // 购物车数量
    cartCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode,
    })
    if (!self.data.scanType) {
      // 0：共用线上购物车需要的提示
      wx.showModal({
        title: '提示',
        content: '您当前扫码门店是' + self.data.deptname + "，请确认后扫码!",
        showCancel: false,
      })
    }
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
    self.setData({
      scanCart: app.globalData.scanCart,
    })
    if (self.data.scanType) {
      // 获取定位
      self.getLocation()
    } else {
      // 更新购物车数量
      self.getCartCount()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    // 关闭购物车弹窗
    self.cancel()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
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

  // 获取定位
  getLocation () {
    let self = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success (res) {
        self.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        // 获取门店列表
        self.getScanShopList()
      },
      fail () {
        toast.toast('获取位置失败，请退出重进')
      }
    })
  },

  // 获取门店列表
  getScanShopList () {
    let self = this
    let data = {
      Longitude: self.data.longitude,
      Latitude: self.data.latitude,
    }
    request.http('invest/microFlow.do?method=listDeptInfo', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (!res.data.length) {
          toast.toast('附近暂无扫码购店铺')
          return false
        } else if (res.data.length >= 1) {
          self.setData({
            scanShopInfo: res.data[0],
            scanShopList: res.data,
          })
          app.globalData.scanShopInfo = res.data[0]
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置门店
  bindPickerChange (e) {
    let self = this
    let scanCart = app.globalData.scanCart
    let shopIndex = e.detail.value
    let old_scanShopInfo = app.globalData.scanShopInfo
    let new_scanShopInfo = self.data.scanShopList[shopIndex]
    if (scanCart.length && old_scanShopInfo.deptcode !== new_scanShopInfo.deptcode) {
      toast.toast('购物车存在商品，请重新进入扫码购！')
      return false
    }
    self.setData({
      shopIndex: shopIndex,
      scanShopInfo: new_scanShopInfo,
    })
    app.globalData.scanShopInfo = new_scanShopInfo
  },

  // 去出场码页面
  toBar () {
    let self = this
    let data = {
      deptcode: self.data.scanShopInfo.deptcode
    }
    request.http('invest/microFlow.do?method=getFlowno', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateTo({
          url: '/scan/pages/bar/bar?barimg=' + res.data.barimg + '&flowno=' + res.data.orderInfo.flowno
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 0：共用线上购物车需要的方法
  // 扫一扫
  scangoodscode () {
    let self = this
    // 验证是否授权
    if (!app.authorFlag()) {
      toast.toast('请授权')
      wx.navigateTo({
        url: '/pages/author/author',
      })
      return false
    }
    // 验证是否绑定手机号码
    if (!app.memcodeflag()) {
      toast.toast('请绑定手机号码')
      wx.switchTab({
        url: '/pages/userInfo/userInfo',
      })
      return false
    }
    wx.scanCode({
      success (res) {
        // 扫码后获取结果参数赋值给Input
        let result = res.result
        if (result) {
          // 订单号码
          self.setData({
            goodscode: result
          })
          // 获取商品信息
          self.getGoodsInfo()
        } else {
          toast.toast('请对准条形码扫码')
        }
      }
    })
  },

  // 获取商品信息
  getGoodsInfo () {
    let self = this
    let data = {
      barcode: self.data.goodscode,
    }
    request.http('info/goods.do?method=getProductDetailsByBarcode', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          goodsInfo: res.data,
          goodsInfoFlag: true,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 关闭购物车弹窗
  cancel () {
    let self = this
    self.setData({
      goodsInfoFlag: false,
    })
  },

  // 加入返回
  addBack () {
    let self = this
    // 加入购物车
    self.addCart()
    // 关闭购物车弹窗
    self.cancel()
  },

  // 加入继续
  addGoOn () {
    let self = this
    // 加入购物车
    self.addCart('goOn')
    // 关闭购物车弹窗
    self.cancel()
  },

  // 加入购物车
  addCart (e) {
    let self = this
    let goodsInfo = self.data.goodsInfo
    let data = {
      Userid: app.globalData.userid,
      Gdscode: goodsInfo.gdscode,
      barflag: 1,
      inputbarcode: goodsInfo.inputbarcode,
    }
    // isstripercode是否称签商品
    if (goodsInfo.isstripercode) {
      data.Actualmoney = goodsInfo.actualmoney
      data.Buyprice = goodsInfo.saleprice
      data.Count = goodsInfo.saleamount
    } else {
      data.Actualmoney = goodsInfo.preferential
      data.Buyprice = goodsInfo.preferential
      data.Count = 1
    }
    request.http('bill/shoppingcar.do?method=inputIntoCar', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 更新购物车数量
        self.getCartCount()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
    if (e) {
      // 扫一扫
      self.scangoodscode()
    }
  },

  // 更新购物车数量
  getCartCount () {
    let self = this
    let data = {}
    request.http('bill/shoppingcar.do?method=getCarProductCount', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let scanType = app.globalData.scanType
        let index = 3
        if (scanType) {
          index = 2
        }
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
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
