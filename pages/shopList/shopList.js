// pages/shopList/shopList.js
//获取应用实例
const app = getApp()
const request = require("../../utils/request.js")
const toast = require("../../utils/toast.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 距离显示开关
    distanceFlag: true,
    // 门店列表
    shopList: [],
    // 用户会员号
    memcode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 隐藏返回首页按钮
    wx.hideHomeButton()
    wx.showLoading({
      title: '正在加载',
    })
    self.setData({
      memcode: app.globalData.memcode
    })
    // 获取定位
    self.getLocation()
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
    request.http('system/dept.do?method=listDeptInfo', data).then(result => {
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          shopList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 选择门店
  changeDept (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let deptcode = self.data.shopList[index].deptcode
    let deptname = self.data.shopList[index].deptname
    let memcode = self.data.memcode
    let data = {
      userid: memcode,
      Deptcode: deptcode
    }
    request.http('system/dept.do?method=changeDept', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        app.globalData.deptname = deptname
        app.globalData.deptcode = deptcode
        wx.switchTab({
          url: '../index/index',
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置默认门店
  setDefaultFlag (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let deptcode = self.data.shopList[index].deptcode
    let deptname = self.data.shopList[index].deptname
    let data = {
      deptcode: deptcode
    }
    request.http('system/dept.do?method=setDefaultFlag', data).then(result => {
      let res = result.data
      // 更新页面默认按钮
      if (res.flag === 1) {
        let shopList = self.data.shopList
        shopList.forEach((val, _index) => {
          if (_index === index) {
            val.defaultflag = 1
          } else {
            val.defaultflag = 0
          }
        })
        self.setData({
          shopList: shopList
        })
        app.globalData.deptcode = deptcode
        app.globalData.deptname = deptname
        wx.switchTab({
          url: '../index/index',
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 取消默认门店
  cancelDefaultFlag (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let deptcode = self.data.shopList[index].deptcode
    let data = {
      deptcode: deptcode
    }
    request.http('system/dept.do?method=cancelDefaultFlag', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 更新页面默认按钮
        if (res.flag === 1) {
          let shopList = self.data.shopList
          shopList[index].defaultflag = 0
          self.setData({
            shopList: shopList
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  }
})