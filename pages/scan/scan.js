// pages/scan/scan.js
const app = getApp()
import toast from '../../utils/toast'
import utils from '../../utils/util'
import API from '../../api/index'

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 获取定位
    self.getLocation()
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
    // 扫码购显示小红点
    self.showBage()
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取定位
  getLocation() {
    let self = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success(res) {
        self.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          // 科飞
          // longitude: 113.292463,
          // latitude: 35.770223,
          // 金威
          // longitude: 113.115401,
          // latitude: 36.206141,
        })
        // 获取门店列表
        self.getScanShopList()
      },
      fail() {
        toast('获取位置失败，请退出重进')
      }
    })
  },

  // 获取门店列表
  getScanShopList() {
    let self = this
    let data = {
      Longitude: self.data.longitude,
      Latitude: self.data.latitude,
    }
    API.invest.listDeptInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (!res.data.length) {
          toast('附近暂无扫码购店铺')
          return false
        } else if (res.data.length >= 1) {
          self.setData({
            scanShopInfo: res.data[0],
            scanShopList: res.data,
          })
          app.globalData.scanShopInfo = res.data[0]
          // 设置title
          self.setTitle()
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置门店
  bindPickerChange(e) {
    let self = this
    let scanCart = app.globalData.scanCart
    let shopIndex = e.detail.value
    let old_scanShopInfo = app.globalData.scanShopInfo
    let new_scanShopInfo = self.data.scanShopList[shopIndex]
    if (scanCart.length && old_scanShopInfo.deptcode !== new_scanShopInfo.deptcode) {
      wx.showModal({
        title: '提示',
        content: '购物车存在商品，确认清空扫码购购物车吗？',
        success: res => {
          // 确认
          if (res.confirm) {
            // 确认按钮
            self.confirm(shopIndex, new_scanShopInfo)
          }
        }
      })
    } else {
      // 确认按钮
      self.confirm(shopIndex, new_scanShopInfo)
    }

  },

  // 确认按钮
  confirm(shopIndex, new_scanShopInfo) {
    let self = this
    self.setData({
      scanCart: [],
      shopIndex: shopIndex,
      scanShopInfo: new_scanShopInfo,
    })
    app.globalData.scanCart = []
    app.globalData.scanShopInfo = new_scanShopInfo
    // 设置title
    self.setTitle()
    // 扫码购显示小红点
    self.showBage()
  },

  // 获取出场码
  toBar() {
    let self = this
    let data = {
      deptcode: self.data.scanShopInfo.deptcode
    }
    API.invest.getFlowno(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateTo({
          url: '/scan/pages/bar/bar?barimg=' + res.data.barimg + '&flowno=' + res.data.orderInfo.flowno
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置title
  setTitle() {
    let self = this
    let scanShopList = self.data.scanShopList
    let shopIndex = self.data.shopIndex
    let deptname = scanShopList[shopIndex].deptname
    wx.setNavigationBarTitle({
      title: deptname
    })
    wx.showModal({
      title: '提示',
      content: '您当前扫码门店是' + deptname + "，请确认后扫码!",
      showCancel: false,
    })
  },

  // 扫码购显示小红点
  showBage() {
    let self = this
    let index = 2
    let { scanCart } = self.data
    if (scanCart.length) {
      wx.setTabBarBadge({
        index: index,
        text: scanCart.length.toString(),
      });
    } else {
      wx.removeTabBarBadge({
        index: index,
      });
    }
  },
})
