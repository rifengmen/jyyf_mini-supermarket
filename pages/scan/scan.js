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
    console.log(e, 'picker');
    let self = this
    self.setData({
      shopIndex: e.detail.value,
      scanShopInfo: self.data.scanShopList[e.detail.value],
    })
    app.globalData.scanShopInfo = self.data.scanShopInfo
  },

  // 去出场码页面
  toBar () {
    let self = this
    let data = {
      deptcode: self.data.deptcode
    }
    request.http('invest/microFlow/getFlowno', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateTo({
          url: '/pages/scan/bar/bar?barimg=' + res.data.barimg + '&flowno=' + res.data.orderInfo.flowno
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
