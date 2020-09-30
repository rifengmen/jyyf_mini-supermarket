// pages/scan/cart/cart.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 打开摄像头方式，1：页面打开时打开；2：点击扫一扫按钮打开
    type: '',
    // 购物车
    scanCart: [],
    // 扫码购店铺
    scanShopInfo: '',
    // 商品条码
    goodscode: '',
    // 商品信息
    goodsInfo: '',
    // 商品信息弹窗开关
    goodsInfoFlag: false,
    // 商品总价
    totalmoney: 0,
    // 流水号
    flowno: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self= this
    self.setData({
      type: parseFloat(options.type),
      scanShopInfo: app.globalData.scanShopInfo,
    })
    if (self.data.type === 1) {
      // 扫一扫
      self.scangoodscode()
    }
    // 计算商品总价
    self.setTotalmoney()
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
    let self= this
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

  // 扫一扫
  scangoodscode () {
    let self = this
    wx.scanCode({
      success (res) {
        // 扫码后获取结果参数赋值给Input
        let result = res.result
        if (result) {
          // 订单号码
          self.setData({
            goodscode: result
          })
          // 获取商品信息
          self.getGoodsInfo()
        } else {
          toast.toast('请对准条形码扫码')
        }
      }
    })
  },

  // 获取商品信息
  getGoodsInfo () {
    let self = this
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
    scanCart.push(...self.data.goodsInfo)
    app.globalData.scanCart = scanCart
    self.setData({
      scanCart: scanCart,
    })
    // 计算商品总价
    self.setTotalmoney()
  },

  // 关闭购物车弹窗
  cancel () {
    let self = this
    self.setData({
      goodsInfoFlag: false,
    })
  },

  // 计算商品总价
  setTotalmoney () {
    let self = this
    let money = 0
    self.data.scanCart.forEach((val, index) => {
      let _money
      _money = parseFloat(val.actualSaleMoney)
      money += _money
    })
    self.setData({
      totalmoney: money.toFixed(2)
    })
  },

  // 结算
  setTlement () {
    wx.navigateTo({
      url: '/pages/scan/editorOrder/editorOrder?flowno=453453864863456786785&deptcode=123456789&deptname=店铺名称'
    })
    let self = this
    if (!self.data.scanCart.length) {
      toast.toast('请添加商品')
      return false
    }
    let data = {
      productList: self.data.scanCart,
      deptcode: self.data.scanShopInfo.deptcode
    }
    request.http('invest/microFlow/saveFlow', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          flowno: res.data.flowno,
          scanCart: [],
        })
        app.globalData.scanCart = []
        wx.navigateTo({
          url: '/pages/scan/editorOrder/editorOrder?flowno=' + self.data.flowno + '&deptcode=' + self.data.scanShopInfo.deptcode + '&deptname=' + self.data.scanShopInfo.deptname
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
