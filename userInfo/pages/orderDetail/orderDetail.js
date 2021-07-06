// userInfo/pages/orderDetail/orderDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
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
    // 订单编号
    tradeno: '',
    // 订单详情
    orderDetail: '',
    // 最终支付
    paymodename: '',
    // 商品总额
    totalMoney: 0,
    // 电子券
    tick: '',
    // 积分抵扣
    score: '',
    // 再支付金额
    againPaymoney: 0,
    // 储值卡名称
    cardname: app.globalData.cardname,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      tradeno: options.tradeno
    })
    // 获取订单详情
    self.getOrderDetail()
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

  // 获取订单详情
  getOrderDetail() {
    let self = this
    let { tradeno, cardname } = self.data
    let data = {
      orderNum: tradeno
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.bill.listOrderDetails(data).then(result => {
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        let orderDetail = res.data
        let PayDetail = res.data.PayDetail
        let tick = ''
        let score = ''
        let paylist = []
        let paymodenameArr = []
        let paymodename = ''
        if (PayDetail.length) {
          tick = PayDetail.filter(item => item.paymodeid === 4)[0] || ''
          score = PayDetail.filter(item => item.paymodeid === 5)[0] || ''
          paylist = PayDetail.filter(item => item.paymodeid !== 4 && item.paymodeid !== 5)
        }
        if (paylist.length) {
          paylist.forEach(item => {
            if (item.paymodeid === 3) {
              paymodenameArr.push(cardname)
            } else if (item.paymodeid === 7) {
              paymodenameArr.push('微信')
            }
          })
          paymodename = paymodenameArr.join('、')
        }
        if (orderDetail.billstatus === 4 || orderDetail.billstatus === 40) {
          orderDetail.freight = 0
          orderDetail.Actprice = 0
        }
        self.setData({
          orderDetail: orderDetail,
          paymodename: paymodename,
          totalMoney: orderDetail.Actprice,
          tick: tick,
          score: score,
          paymoney: (orderDetail.Actprice - (tick.paymoney || 0) - (score.paymoney || 0) + orderDetail.freight + orderDetail.delivermoney).toFixed(2),
          againPaymoney: (orderDetail.shouldmoney - orderDetail.paymoney).toFixed(2)
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 返回
  backs() {
    let self = this
    app.globalData.ordernum = self.data.tradeno
    wx.navigateBack()
  },

  // 去结算
  toBuyEnd() {
    let self = this
    let buyEnd = self.selectComponent('#buyEnd')
    let goods = {
      otc: '',
      isotc: '',
      orderType: '',
      Gdscode: '',
      amount: '',
    }
    // 调用子组件，传入商品信息
    buyEnd.toBuyEnd(goods)
  },
})
