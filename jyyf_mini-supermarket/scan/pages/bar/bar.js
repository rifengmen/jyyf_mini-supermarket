// scan/pages/bar/bar.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // baseUrl基础路径
    baseUrl: app.globalData.baseUrl,
    // 出场码显示开关
    flag: true,
    // 条码
    barimg: '',
    // 店铺信息
    deptcode: '',
    deptname: '',
    // 订单flowno
    flowno: '',
    // 订单详情
    orderDetail: '',
    // 订单商品列表
    goodsList: '',
    // 经纬度
    longitude: 0,
    latitude: 0,
    // 扫码购门店信息
    scanShopInfo: '',
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let barimg = options.barimg || ''
    let flowno = options.flowno || ''
    if (barimg && flowno) {
      self.setData({
        // 条码
        barimg: barimg,
        // 店铺信息
        deptcode: app.globalData.scanShopInfo.deptcode,
        deptname: app.globalData.scanShopInfo.deptname,
        // 订单flowno
        flowno: flowno,
      })
      // 获取订单详情
      self.getOrderDetail()
    } else {
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
    API.invest.listDeptInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (!res.data.length) {
          toast.toast('附近暂无扫码购店铺')
          return false
        } else if (res.data.length >= 1) {
          self.setData({
            scanShopInfo: res.data[0],
          })
          // 获取出场码
          self.getBar()
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取出场码
  getBar () {
    let self = this
    let data = {
      deptcode: self.data.scanShopInfo.deptcode
    }
    API.invest.getFlowno(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          barimg: res.data.barimg,
          flowno: res.data.flowno,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 切换出场码和详情
  toggleFlag () {
    let self = this
    self.setData({
      flag: !self.data.flag
    })
  },

  // 获取订单详情
  getOrderDetail () {
    let self = this
    let data = {
      flowno: self.data.flowno,
      deptcode: self.data.deptcode
    }
    API.invest.listMicroFlowDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data) {
          self.setData({
            orderDetail: res.data,
            goodsList: res.data.gdscodeList
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 关闭出场码
  closeBar () {
    wx.navigateBack()
  }
})
