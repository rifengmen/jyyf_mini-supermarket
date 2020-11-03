// autoModule/pages/buyGoodsList/buyGoodsList.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 请求开关
    getFlag: false,
    // 购买商品列表
    buyGoodsList: [],
    // 查询开始时间
    startdate: '',
    // 页码
    page: 1,
    // 每页条数
    count: 15,
    // 总条数
    rowCount: 0,
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
      buyGoodsList: [],
    })
    // 获取购买商品列表
    self.getBuyGoodsList()
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
    // 获取购买商品列表
    self.getBuyGoodsList()
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
      buyGoodsList: [],
    })
    // 获取购买商品列表
    self.getBuyGoodsList()
  },

  // 获取购买商品列表
  getBuyGoodsList () {
    let self = this
    let data = {
      Cardnum: app.globalData.memcode,
      Page: self.data.page,
      pageSize: self.data.count,
      Startday: self.data.startdate,
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http('mem/member.do?method=listMemberConsumGdscode', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          buyGoodsList: res.data
        })
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
})
