//index.js
//获取应用实例
const app = getApp()
const request = require("../../utils/request.js")
const toast = require("../../utils/toast.js")

Page({
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 门店名称
    deptname: '',
    // 搜索内容
    search_val: '',
    // 通知列表
    noticeList: [
      "测试通知公告11，测试通知公告11，测试通知公告11，测试通知公告11",
      "测试通知公告22，测试通知公告，测试通知公告，测试通知公告",
      "测试通知公告33，测试通知公告，测试通知公告，测试通知公告",
      "测试通知公告44，测试通知公告，测试通知公告，测试通知公告",
      "测试通知公告55，测试通知公告，测试通知公告，测试通知公告",
    ],
    // banner图 图片
    bannerList: [
      "/lib/images/ceshi000.png",
      "/lib/images/ceshi001.png",
      "/lib/images/ceshi002.png",
      "/lib/images/ceshi003.png",
      "/lib/images/ceshi004.png"
    ],
    // 自定义模块列表
    modulePictureList: [
      {modulename: "抢购商品", moduletype: 14, picturename: "../../lib/images/ceshi001.png", no: 1},
      {modulename: "抢购商品", moduletype: 15, picturename: "../../lib/images/ceshi001.png", no: 2},
      {modulename: "抢购商品", moduletype: 16, picturename: "../../lib/images/ceshi001.png", no: 3},
      {modulename: "抢购商品", moduletype: 17, picturename: "../../lib/images/ceshi001.png", no: 4},
      {modulename: "抢购商品", moduletype: 18, picturename: "../../lib/images/ceshi001.png", no: 5},
      {modulename: "抢购商品", moduletype: 19, picturename: "../../lib/images/ceshi001.png", no: 6},
      {modulename: "抢购商品", moduletype: 13, picturename: "../../lib/images/ceshi001.png", no: 7},
      {modulename: "抢购商品", moduletype: 10, picturename: "../../lib/images/ceshi001.png", no: 8},
      {modulename: "抢购商品", moduletype: 9, picturename: "../../lib/images/ceshi001.png", no: 9},
      {modulename: "抢购商品", moduletype: 2, picturename: "../../lib/images/ceshi001.png", no: 10}
    ],
    // 是否显示下拉提示
    isPullDownShow: false,
    // 下拉刷新提示文字
    pullDownText: true,
    // 商品列表
    goodsList: [],

    show1: false,
    show2: false,
    allC: 0,
    allM: 0
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
    let self = this
    self.setData({
      search_val: app.globalData.search_val,
      deptname: app.globalData.deptname
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
    wx.showLoading({
      title: '内容刷新中...'
    })
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

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove (res) {
    return false
  },

  // 获取banner图列表
  getBannerList () {
    let data = {}
    request.http('', data).then(res => {
      console.log(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取公告列表
  getNoticeList () {
    let data = {}
    request.http('', data).then(res => {
      
    }).catch(error => {
      toast.toast(error.error)
    })
  }
})
