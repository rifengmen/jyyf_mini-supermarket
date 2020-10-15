// pages/shopBag/shopBag.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 购物袋列表
    shopBagList: [],
    // 请求开关
    getFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 获取购物袋列表
    self.getShopBagList()
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
      shopBagList: [],
    })
    // 获取购物袋列表
    self.getShopBagList()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
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

  // 获取购物袋列表
  getShopBagList () {
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
    }
    request.http('bill/shoppingcar.do?method=getShoppingBagList', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let shopBagList = res.data.shoppingbaglist
        shopBagList.forEach((item, index) => {
          item.amount = 1
          item.check = false
        })
        self.setData({
          shopBagList: shopBagList,
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

  // 选中商品/不选商品
  setCheck(e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    let shopBagList = self.data.shopBagList
    shopBagList.forEach(item => {
      if (item.gdscode === goods.gdscode) {
        item.check = !item.check
      }
    })
    self.setData({
      shopBagList: shopBagList,
    })
  },

  // 购物车加的方法
  addCart(e) {
    let self = this
    let index = e.currentTarget.dataset.index
    // 购物车数量操作
    self.editorCartCount('addCart', index)
  },

  // 购物车减得方法
  subtrackCart(e) {
    let self = this
    let index = e.currentTarget.dataset.index
    // 购物车数量操作
    self.editorCartCount('subtrackCart', index)
  },

  // 购物车数量操作
  editorCartCount(method, index) {
    let self = this
    let shopBagList = self.data.shopBagList
    // 判断加减
    if (method === 'addCart') {
      shopBagList[index].amount++
    } else if (method === 'subtrackCart') {
      if (shopBagList[index].amount <= 1) {
        shopBagList[index].amount = 1
      } else {
        shopBagList[index].amount--
      }
    }
    self.setData({
      shopBagList: shopBagList
    })
  },

  // 去编辑订单页面
  toEditorOrder () {
    let self = this
    let shopBagList = self.data.shopBagList.filter(item => item.check)
    let data = {
      buybaglist: shopBagList,
    }
    request.http('bill/shoppingcar.do?method=buyShoppingBag', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.redirectTo({
          url: '/pages/editorOrder/editorOrder',
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
