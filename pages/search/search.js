// pages/search/search.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索内容
    search_val: '',
    // 搜索历史列表
    hostoryList: [
      {name: '搜索1'},
      {name: '搜索2'},
      {name: '搜索3'},
      {name: '搜索4'},
      {name: '搜索5'},
      {name: '搜索6'},
      {name: '搜索'},
      {name: '搜索8'},
      {name: '搜索9'},
      {name: '搜索10'},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      search_val: app.globalData.search_val
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

  // 获取搜索记录
  getHistoryList () {
    let self = this
    let data = {}
    request.http('', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          hostoryList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 清空搜索记录
  clearHistoryList () {
    console.log('清空搜索记录')
  },

  // 去搜索列表页
  toGoodsList (e) {
    let sname = e.detail.value
    let title = '搜索列表'
    app.globalData.search_val = sname
    wx.navigateTo({
      url: '/pages/goodsList/goodsList?sname=' + sname + '&title=' + title,
    })
  },

  // 获取商品列表
  getGoodsList (e) {
    let self = this
    let data = {
      Sname: e.detail.value,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
      Page: self.data.page,
      pageSize: self.data.count,
      barcode: '',
      Scode: '',
    }
    request.http('info/goods.do?method=getProductListByshortcode', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.hideLoading()
        app.globalData.search_val = e.detail.value
        self.setData({
          search_val: e.detail.value,
          historyFlag: false,
          goodsList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
