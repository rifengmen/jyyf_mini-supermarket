// shopping/pages/search/search.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索内容
    search_val: '',
    // 搜索历史列表
    historyList: [],
    // 热门搜索列表
    hotSearchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      search_val: app.globalData.search_val
    })
    // 获取搜索记录
    self.getHistoryList()
    // 获取热门搜索列表
    self.getHotSearchList()
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

  // 获取搜索记录
  getHistoryList () {
    let self = this
    let data = {}
    API.system.getDept(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          historyList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取热门搜索列表
  getHotSearchList () {
    let self = this
    let data = {}
    API.system.getDept(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          hotSearchList: res.data
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
    let Sname = e.detail.value
    let title = '搜索列表'
    app.globalData.search_val = Sname
    wx.navigateTo({
      url: '/shopping/pages/goodsList/goodsList?Sname=' + Sname + '&title=' + title,
    })
  },
})
