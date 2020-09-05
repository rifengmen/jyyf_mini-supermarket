// pages/auto/commentList/commentList.js
const app = getApp()
const request = require("../../../utils/request.js")
const toast = require("../../../utils/toast.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面title
    title: '',
    // 上一级页面
    from: '',
    // 商品code
    gdscode: '',
    // EType,评论类型（0全部，好评1，中评2，差评3）
    EType: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let title = options.title
    let from = options.from
    let gdscode = options.gdscode || ''
    self.setData({
      title: title,
      from: from,
      gdscode: gdscode,
    })
    // 设置title
    wx.setNavigationBarTitle({
      title: self.data.title, 
    })
    if (from === 'goodsDetail') {
      // 获取商品评价列表
      self.getGoodsCommentList()
    } else if (from === 'auto') {
      // 获取我的评价列表
      self.getMyCommentList()
    }
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

  // 获取商品评价列表
  getGoodsCommentList () {
    let self = this
    let data = {
      gdscode: self.data.gdscode,
      EType: self.data.EType,
    }
    let url = 'bill/evaluation.do?method=getProductEvaluation'
    // 获取评价列表
    self.getCommentList(url, data)
  },

  // 获取我的评价列表
  getMyCommentList () {},

  // 获取评价列表
  getCommentList (url, data) {
    let self = this
    request.http(url, data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          commentList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})