// pages/shopBag/shopBag.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 购物车
    scanCart: [],
    // 积分
    score: '',
    // 积分抵扣金额
    useScoreMoney: 0,
    // 积分使用开关
    scoreFlag: false,
    // 电子券
    tick: '',
    // 电子券可用标识
    isUseTickflag: true,
    // 商品总价
    totalmoney: 0,
    // 支付金额
    paymoney: 0,
    // 请求开关
    getFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
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
    let data = {}
    API.bill.getShoppingBagList(data).then(result => {
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        let shopBagList = res.data.shoppingbaglist
        shopBagList.forEach((item, index) => {
          item.amount = 0
          item.check = false
        })
        self.setData({
          shopBagList: shopBagList,
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
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

  // 获取可用积分
  getScore () {
    let self = this
    let data = {
      payMoney: self.data.paymoney,
      Totalmoney: self.data.totalmoney,
    }
    self.setData({
      scoreFlag: false,
      useScoreMoney: 0,
    })
    API.bill.payMoneyjf(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          score: res.data,
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置积分使用开关
  setScoreFlag (e) {
    let self = this
    let scoreFlag = self.data.scoreFlag
    let score = self.data.score
    if (scoreFlag) {
      self.setData({
        scoreFlag: false,
        useScoreMoney: 0
      })
    } else {
      self.setData({
        scoreFlag: true,
        useScoreMoney: score.Money,
      })
    }
    // 计算商品总价
    self.setTotalmoney()
  },

  // 计算商品总价
  setTotalmoney () {
    let self = this
    let totalmoney = 0
    let paymoney = 0
    // 积分抵扣金额
    let useScoreMoney = self.data.useScoreMoney || 0
    // 电子券
    let tickMoney = self.data.tick.paymoney || 0
    let scanCart = self.data.scanCart
    scanCart.forEach(item => {
      let _money
      _money = parseFloat(item.actualSaleMoney)
      totalmoney += _money
    })
    paymoney = (totalmoney - useScoreMoney - tickMoney).toFixed(2)
    self.setData({
      totalmoney: totalmoney.toFixed(2),
      paymoney: paymoney
    })
    if (!self.data.scoreFlag) {
      // 获取可用积分
      self.getScore()
    }
  },
})
