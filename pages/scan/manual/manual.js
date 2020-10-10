// pages/scan/manual/manual.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品条码
    goodscode: '',
    // 商品信息
    goodsInfo: '',
    // 商品信息弹框开关
    goodsInfoFlag: false,
    // 店铺信息
    scanShopInfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      scanShopInfo: app.globalData.scanShopInfo
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

  // 商品条码
  setGoodscode (e) {
    let self = this
    self.setData({
      goodscode: e.detail.value
    })
  },

  // 清除商品条码
  clearGoodscode () {
    let self = this
    self.setData({
      goodscode: ''
    })
  },

  // 获取商品信息
  getGoodsInfo () {
    let self = this
    // 验证条码不为空
    if (!self.data.goodscode) {
      toast.toast('请输入商品条码！')
      return false
    }
    // 验证店铺不为空
    if (!self.data.scanShopInfo) {
      toast.toast('请选择店铺！')
      return false
    }
    let data = {
      barcode: self.data.goodscode,
      deptcode: self.data.scanShopInfo.deptcode
    }
    request.http('invest/microFlow.do?method=getProductDetailsByBarcode', data).then(result => {
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

  // 添加商品到购物车
  addScancart () {
    let self = this
    let scanCart = app.globalData.scanCart
    scanCart.push(self.data.goodsInfo)
    app.globalData.scanCart = scanCart
    // 关闭购物车弹窗
    self.cancel()
  },

  // 关闭购物车弹窗
  cancel () {
    let self = this
    self.setData({
      goodsInfoFlag: false,
    })
  },
})
