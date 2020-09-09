// pages/editorOrder/editorOrder.js
const app = getApp()
const request = require("../../utils/request.js")
const toast = require("../../utils/toast.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 门店名称
    deptname: '',
    // 收货方式开关
    pickTypeFlag: false,
    // 收货方式,0:自提;1:配送
    pickType: 1,
    // 收货地址
    address: '',
    // 订单商品数量
    orderCount: 999,
    // 购物车列表
    cartList: [],
    // 订单备注
    remark: '',

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
    self.setData({
      deptname: app.globalData.deptname,
      address: app.globalData.address
    })
    // 获取购物车列表
    self.getCartList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    self.setData({
      pickTypeFlag: false,
    })
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

  // 获取购物车列表
  getCartList () {
    let self = this
    let data = {}
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http('bill/shoppingcar.do?method=listMyCar', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cartList: res.data.carList,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置订单备注
  setRemark (e) {
    let self = this
    self.setData({
      remark: e.detail.value,
    })
  },

  // 设置收货方式开关
  setPickTypeFlag () {
    let self = this
    self.setData({
      pickTypeFlag: !self.data.pickTypeFlag
    })
  },

  // 阻止冒泡,空方法
  setStop () {},

  // 设置收货方式
  setPickType (e) {
    let self = this
    self.setData({
      pickType: parseInt(e.detail.value)
    })
  },

  // 收货方式下一步
  nextBtn () {
    let self = this
    if (self.data.pickType) {
      wx.navigateTo({
        url: '/pages/userInfo/addressList/addressList',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userInfo/selfPickUp/selfPickUp',
      })
    }
  },
})