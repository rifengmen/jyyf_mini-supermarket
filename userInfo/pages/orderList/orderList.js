// userInfo/pages/orderList/orderList.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单状态 0全部  1待支付  2待中转  3待收货  9已完成
    statusType: 0,
    // 订单状态列表
    statusList: app.globalData.statusList,
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
    let self = this
    let ordernum = app.globalData.ordernum
    // 检查是否取消后返回进入，订单列表对应数据刷新
    if (ordernum) {
      let e = {
        detail: ordernum
      }
      // 设置订单列表
      self.setOrderList(e)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 清空取消后返回进入设置的订单详情
    app.globalData.ordernum = ''
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
      getFlag: false,
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
      toast('暂无更多')
      return false
    }
    // 获取订单列表
    self.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

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
      pageSize: self.data.count,
      statusType: self.data.statusType,
    }
    API.bill.listMyOrder(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderList = self.data.orderList
        let n_orderList = res.data
        n_orderList.forEach(item => {
          if (item.billstatus === 4 || item.billstatus === 40) {
            item.Totalprice = 0
            item.Actprice = 0
          }
        })
        orderList.push(...n_orderList)
        self.setData({
          orderList: orderList,
          rowCount: res.rowCount
        })
      } else {
        toast(res.message)
      }
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
    }).catch(error => {
      toast(error.error)
    })
  },

  // 去再支付页面
  toAgainPay (e) {
    let self = this
    let tradeno = e.currentTarget.dataset.tradeno
    wx.navigateTo({
      url: '/userInfo/pages/againPay/againPay?tradeno=' + tradeno
    })
  },

  // 设置订单列表
  setOrderList (e) {
    let self = this
    let ordernum = Number(e.detail)
    let orderList = self.data.orderList
    orderList.forEach(item => {
      if (Number(item.ordernum) === ordernum) {
        item.billstatus = 40
        item.Totalprice = 0
        item.Actprice = 0
        item.payflag = 0
        item.cancelflag = 0
        item.billstatusdescribe = item.ordernum + '申请订单取消'
      }
    })
    self.setData({
      orderList: orderList
    })
  },

  // 去结算
  toBuyEnd(e) {
    let self = this
    let tradeno = e.currentTarget.dataset.tradeno
    let buyEnd = self.selectComponent('#buyEnd' + tradeno)
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
