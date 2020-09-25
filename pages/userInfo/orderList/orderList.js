// pages/userInfo/orderList/orderList.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单类型 0全部  1待支付  2待取送 3待发货  9待退款 20已完成
    statusType: 0,
    // 订单类型列表
    statusList: [
      {name: '全部', type: 0},
      {name: '待支付', type: 1},
      {name: '待取送', type: 2},
      {name: '待发货', type: 3},
      {name: '已完成', type: 9},
      {name: '退款/售后', type: 20},
    ],
    // 查询开始日期
    startdate: '',
    // 订单列表
    orderList: [],
    // 请求开关
    getFlag: false,
    // 页数
    page: 1,
    // 每页条数
    count: 10,
    // 商品总条数
    rowCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      statusType: parseFloat(options.orderType) || 0
    })
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
    self.setData({
      page: 1,
      orderList: [],
    })
    // 获取订单列表
    self.getOrderList()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    // 计算总页数
    let totalPage = Math.ceil(self.data.rowCount / self.data.count)
    // 下一页
    let page = self.data.page
    page++
    self.setData({
      page: page
    })
    if (self.data.page > totalPage) {
      toast.toast('暂无更多')
      return false
    }
    // 获取订单列表
    self.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 切换选项
  setStatusType (e) {
    let self = this
    let statusType = e.currentTarget.dataset.type
    self.setData({
      statusType: statusType,
      page: 1,
      orderList: [],
    })
    // 获取订单列表
    self.getOrderList()
  },

  // 设置查询开始日期
  setStartdate (e) {
    let self = this
    self.setData({
      startdate: e.detail,
      page: 1,
      orderList: [],
    })
    // 获取订单列表
    self.getOrderList()
  },

  // 获取订单列表
  getOrderList () {
    let self = this
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    let data = {
      Starttime: self.data.startdate,
      Page: self.data.page,
      statusType: self.data.statusType,
    }
    request.http('bill/order.do?method=listMyOrder', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderList = self.data.orderList
        orderList.push(...res.data)
        self.setData({
          orderList: orderList,
          rowCount: res.rowCount
        })
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

  // 去再支付页面
  toAgainPay (e) {
    let self = this
    let tradeno = e.currentTarget.dataset.tradeno
    wx.navigateTo({
      url: '/pages/userInfo/againPay/againPay?tradeno=' + tradeno
    })
  },

  // 设置订单列表
  setOrderList (e) {
    let self = this
    // 重新请求
    self.setData({
      page: 1,
      orderList: [],
    })
    self.getOrderList()
  },
})
