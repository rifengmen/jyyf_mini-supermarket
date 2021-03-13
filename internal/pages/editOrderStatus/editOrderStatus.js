// internal/pages/editOrderStatus/editOrderStatus.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 订单详情
    orderDetail: '',
    // 身份标识，默认0,0:顾客,1:拣货,2:配送,3:取货
    role: 0,
    // 身份标识列表
    roleList: [],
    // 身份详情
    roledetail: '',
    // 手机号
    mobile: app.globalData.mobile,
    // 订单编号
    tradeno: '',
    // 定位
    longitude: '',
    latitude: '',
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let role = Number(options.role)
    let roleList = app.globalData.roleList
    let roledetail = roleList.filter(item => item.role === role)[0]
    self.setData({
      role: role,
      roleList: roleList,
      roledetail: roledetail,
    })
    wx.setNavigationBarTitle({
      title: roledetail.name
    })
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
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
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
          latitude: res.latitude,
        })
      }
    })
  },

  // 设置订单号
  setTradeno (e) {
    let self = this
    let tradeno = e.detail.value
    self.setData({
      tradeno: tradeno,
    })
  },

  // 变更订单状态
  pickOrder () {
    let self = this
    let data = {
      role: self.data.role,
      tradeno: self.data.tradeno,
      phone: self.data.mobile,
      longitude: self.data.longitude,
      latitude: self.data.latitude,
    }
    // 获取当前位置信息
    API.bill.pickOrder(data).then(result => {
      let res = result.data
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 重置订单编号
  resetTradeno () {
    let self = this
    self.setData({
      tradeno: '',
    })
  },

  // 扫一扫
  scanTradeno () {
    let self = this
    wx.scanCode({
      success (res) {
        // 扫码后获取结果参数赋值给Input
        let result = res.result
        if (result) {
          // 订单号码
          self.setData({
            tradeno: result
          })
          // 获取订单详情
          self.getOrderDetail()
        } else {
          toast.toast('请对准条形码扫码')
        }
      }
    })
  },

  // 获取订单详情
  getOrderDetail () {
    let self = this
    let data = {
      orderNum: self.data.tradeno
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.bill.listOrderDetails(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderDetail = res.data
        self.setData({
          orderDetail: orderDetail,
        })
      } else {
        toast.toast(res.message)
      }
      wx.hideLoading()
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 确定按钮
  confrim () {
    let self = this
    // 判断订单编号不为空
    if (self.data.tradeno) {
      // 判断查询订单详情还是修改订单状态
      if (self.data.orderDetail) {
        // 修改订单状态
        self.pickOrder()
      } else {
        // 获取订单详情
        self.getOrderDetail()
      }
    }
  },
})
