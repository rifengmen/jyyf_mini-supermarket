const app = getApp()
const request = require("../../utils/request.js")
const toast = require("../../utils/toast.js")

// pages/goodsList/goodsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示下拉提示
    isPullDownShow: false,
    // 下拉刷新提示文字
    pullDownText: true,
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 推荐商品id
    cateid: '',
    // 列表类型，4：常购商品；2：会员特价；1：特价商品；3：推荐商品
    datatype: '',
    // 抢购商品
    panicBuy: '',
    // 分类商品code
    classCode: '',
    // 搜索关键字
    sname: '',
    // title
    title: '',
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 页数
    page: 1,
    // 每页条数
    count: 15,
    // 商品总条数
    rowCount: 0,
    // 排序方式（1销量、2人气、3价格)
    sortflg: 1,
    // 升序降序 (0升序、1降序)
    sorttype: 0,
    // 热门分类标志 默认0
    hotCategoryflag: 1,
    // 商品列表
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      cateid: options.cateid || '',
      datatype: options.Datatype || '',
      panicBuy: options.panicBuy || '',
      classCode: options.classCode || '',
      sname: options.sname || '',
      title: options.title,
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode
    })
    // 设置title
    wx.setNavigationBarTitle({
      title: self.data.title, 
    })
    // 请求对应商品列表
    self.sendMethods()
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
      page: 1
    })
    // 请求对应商品列表
    self.sendMethods()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    // 计算总页数
    let totalPage = Math.ceil(self.data.rowCount / self.data.count)
    self.setData({
      page: page++
    })
    if (self.data.page > totalPage) {
      toast.toast('暂无更多商品')
      return false
    }
    // 请求对应商品列表
    self.sendMethods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 请求对应商品列表
  sendMethods () {
    let self= this
    if (self.data.moduletype) {
      // 获取自定义商品列表
      self.getAutoGoodsList()
    } else if (self.data.panicBuy) {
      // 获取抢购商品列表
      self.getPanicBuyGoodsList()
    } else if (self.data.classCode) {
      // 获取分类商品列表
      self.getCodeGoodsList()
    } else if (self.data.sname) {
      // 获取搜索商品列表
      self.getSearchGoodsList()
    } else if (self.data.cateid) {
      // 获取推荐商品列表
      self.getGoodsList()
    }
  },

  // 获取推荐商品列表
  getGoodsList () {
    let self = this
    let data = {
      Cateid: self.data.cateid,
      Page: self.data.page,
      Count: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
      HotCategoryflag: self.data.hotCategoryflag,
    }
    let url = 'info/goods.do?method=getProductListByCate'
    // 发送列表请求
    self.getList(data, url)
  },

  // 获取自定义商品列表
  getAutoGoodsList () {
    let self = this
    let data = {
      Datatype: self.data.moduletype,
      Page: self.data.page,
      Count: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
    }
    let url = 'info/goods.do?method=getProductList'
    // 发送列表请求
    self.getList(data, url)
  },

  // 获取抢购商品列表
  getPanicBuyGoodsList () {
    let self = this
    let data = {}
    let url = 'info/panicGdscode.do?method=listPanicBuyGdscode'
    // 发送列表请求
    self.getList(data, url)
  },

  // 获取分类商品列表
  getCodeGoodsList () {
    let self = this
    let data = {
      Classcode: self.data.classCode,
      Page: self.data.page,
      Count: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype
    }
    let url = 'info/goods.do?method=getProductListByCateCode'
    // 发送列表请求
    self.getList(data, url)
  },

  // 获取搜索商品列表
  getSearchGoodsList () {
    let self = this
    let data = {
      Sname: self.data.sname,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
      Page: self.data.page,
      pageSize: self.data.count,
      barcode: '',
      Scode: '',
    }
    let url = 'info/goods.do?method=getProductListByshortcode'
    // 发送列表请求
    self.getList(data, url)
  },

  // 发送列表请求
  getList (data, url) {
    wx.showLoading({
      title: '正在加载',
    })
    let self = this
    request.http(url, data).then(result => {
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        wx.hideLoading()
        self.setData({
          goodsList: res.data,
          rowCount: res.rowCount
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})