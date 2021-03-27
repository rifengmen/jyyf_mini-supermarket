// pages/shopList/shopList.js
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 距离显示开关
    distanceFlag: true,
    // 门店列表
    shopList: [],
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 显示当前门店
    self.setData({
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode,
      shopList: app.globalData.shopList,
    })
    // 判断门店列表存在
    if (!self.data.shopList.length) {
      // 获取定位
      self.getLocation()
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
    // 隐藏小房子按钮
    wx.hideHomeButton()
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
    // 未获取定位不显示距离
    if (!longitude && !latitude) {
      self.setData({
        distanceFlag: false
      })
    }
    let data = {
      Longitude: longitude,
      Latitude: latitude,
      deptType: 1
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.system.listDeptInfo(data).then(result => {
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        let shopList = res.data
        self.setData({
          shopList: shopList,
        })
        app.globalData.shopList = shopList
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 选择门店
  changeDept (e) {
    let self = this
    let shop = e.currentTarget.dataset.shop
    let o_deptcode = app.globalData.deptcode
    let deptcode = shop.deptcode
    let deptname = shop.deptname
    // 判断选择门店是否为当前门店，是：返回；否则重新加载
    if (o_deptcode === deptcode) {
      wx.navigateBack()
    } else {
      app.globalData.deptname = deptname
      app.globalData.deptcode = deptcode
      // 清空扫码购购物车
      app.globalData.scanCart = []
      wx.reLaunch({
        url: '/pages/index/index?deptname=' + deptname + '&deptcode=' + deptcode,
      })
    }
  },

  // 修改默认门店
  changeDefaultFlag (e) {
    let self = this
    let shop = e.currentTarget.dataset.shop
    let deptcode = shop.deptcode
    let deptname = shop.deptname
    let defaultflag = shop.defaultflag
    if (defaultflag) {
      // 取消默认门店
      self.cancelDefaultFlag(deptcode)
    } else {
      // 设置默认门店
      self.setDefaultFlag(deptcode)
    }
  },

  // 设置默认门店
  setDefaultFlag (deptcode) {
    let self = this
    let data = {
      deptcode: deptcode
    }
    API.system.setDefaultFlag(data).then(result => {
      let res = result.data
      // 更新页面默认按钮
      if (res.flag === 1) {
        let shopList = self.data.shopList
        shopList.forEach((item) => {
          if (item.deptcode === deptcode) {
            item.defaultflag = 1
          } else {
            item.defaultflag = 0
          }
        })
        self.setData({
          shopList: shopList
        })
        app.globalData.shopList = shopList
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 取消默认门店
  cancelDefaultFlag (deptcode) {
    let self = this
    let data = {
      deptcode: deptcode
    }
    API.system.cancelDefaultFlag(data).then(result => {
      let res = result.data
      // 更新页面默认按钮
      if (res.flag === 1) {
        let shopList = self.data.shopList
        shopList.forEach(item => {
          if (item.deptcode === deptcode) {
            item.defaultflag = 0
          }
        })
        self.setData({
          shopList: shopList
        })
        app.globalData.shopList = shopList
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 显示地图
  showMap (e) {
    let self = this
    let shop = e.currentTarget.dataset.shop
    wx.openLocation({
      longitude: shop.Longitude,
      latitude: shop.Latitude,
      scale: 18,
      name: shop.deptname,
      address: shop.Contact,
    })
  },
})
