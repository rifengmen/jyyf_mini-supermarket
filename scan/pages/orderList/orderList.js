// scan/pages/orderList/orderList.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    let self= this
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
    }
    API.invest.listMicroFlow(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderList = self.data.orderList
        orderList.push(...res.data)
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

  // 取消按钮
  cancelBtn (e) {
    let self = this
    let id = '#scanCancelBtn' + e.currentTarget.dataset.index
    let scanCancelBtn = self.selectComponent(id)
    scanCancelBtn.isCancel()
  },
})
