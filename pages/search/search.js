// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索内容
    search_val: '',
    // 搜索历史
    historyFlag: true,
    // 商品列表
    searchList: [],
    // 页数
    page: 1,
    // 每页条数
    pageSize: 15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search_val: getApp().globalData.search_val
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
  // 获取搜索结果列表
  getSearchList (e) {
    var globalData = getApp().globalData
    globalData.search_val = e.detail.value
    this.setData({
      search_val: globalData.search_val,
      historyFlag: false,
      searchList: [
        {
          name: '商品名称000001',
          desc: '测试商品000001介绍，测试商品000001介绍，测试商品000001介绍，测试商品000001介绍',
          goodsid: '000001'
        },
        {
          name: '商品名称000002',
          desc: '测试商品000002介绍，测试商品000001介绍，测试商品000001介绍，测试商品000001介绍',
          goodsid: '000002'
        },
        {
          name: '商品名称000003',
          desc: '测试商品000003介绍，测试商品000001介绍，测试商品000001介绍，测试商品000001介绍',
          goodsid: '000003'
        },
        {
          name: '商品名称000004',
          desc: '测试商品000004介绍，测试商品000001介绍，测试商品000001介绍，测试商品000001介绍',
          goodsid: '000004'
        },
        {
          name: '商品名称000005',
          desc: '测试商品000005介绍，测试商品000001介绍，测试商品000001介绍，测试商品000001介绍',
          goodsid: '000005'
        }
      ]
    })
  },
  // 设置搜索历史展示开关
  setHistoryFlag () {
    this.setData({
      historyFlag: true
    })
  }
})