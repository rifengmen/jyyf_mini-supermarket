// shopping/pages/goodsList/goodsList.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片路径为空时默认图路径
    errorImage: app.globalData.errorImage,
    // 是否显示下拉提示
    isPullDownShow: false,
    // 下拉刷新提示文字
    pullDownText: true,
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 列表显示方式listType,2:两列，1:一列
    listType: 2,
    // 推荐商品id
    Cateid: '',
    // 列表类型，4：常购商品；2：会员特价；1：特价商品；3：推荐商品
    Datatype: '',
    // 秒杀商品
    panicBuy: '',
    // 分类商品code
    Classcode: '',
    // 搜索关键字
    Sname: '',
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
    goodsList: [],
    // 购物车数量
    cartCount: 0,
    // 请求开关
    getFlag: false,
    // 弹框组件显示开关
    dialogFlag: false,
    // 商品信息
    goods: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      // 单分类/集群
      Cateid: options.Cateid || '',
      // 自定义区
      Datatype: options.Datatype || '',
      Classid: options.Classid || '',
      // 秒杀
      panicBuy: options.panicBuy || '',
      // 轮播图(分类)
      Classcode: options.Classcode || '',
      // 搜索
      Sname: options.Sname || '',
      title: options.title,
      deptname: options.deptname ||app.globalData.deptname,
      deptcode: options.deptcode || app.globalData.deptcode
    })
    // 从分享进来时设置门店信息
    app.globalData.deptname = self.data.deptname
    app.globalData.deptcode = self.data.deptcode
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
    let self = this
    // 更新购物车数量
    self.getCartCount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    // 弹窗关闭
    self.dialogClose()
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
      goodsList: [],
    })
    // 请求对应商品列表
    self.sendMethods()
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
    if (self.data.panicBuy || self.data.page > totalPage) {
      toast.toast('暂无更多')
      return false
    }
    // 请求对应商品列表
    self.sendMethods()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 设置列表显示样式
  setListType () {
    let self = this
    let listType = self.data.listType
    if (listType === 1) {
      listType = 2
    } else if (listType === 2) {
      listType = 1
    }
    self.setData({
      listType: listType
    })
  },

  // 请求对应商品列表
  sendMethods () {
    let self= this
    if (self.data.Datatype) {
      // 获取自定义商品列表
      self.getAutoGoodsList()
    } else if (self.data.panicBuy) {
      // 获取秒杀商品列表
      self.getPanicBuyGoodsList()
    } else if (self.data.Classcode) {
      // 获取轮播图(分类)商品列表
      self.getCodeGoodsList()
    } else if (self.data.Sname) {
      // 获取搜索商品列表
      self.getSearchGoodsList()
    } else if (self.data.Cateid) {
      // 获取单分类/集群商品列表
      self.getGoodsList()
    }
  },

  // 获取单分类/集群商品列表
  getGoodsList () {
    let self = this
    let data = {
      Cateid: self.data.Cateid,
      Page: self.data.page,
      Count: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
      HotCategoryflag: self.data.hotCategoryflag,
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.info.getProductListByCate(data).then(result => {
      let res = result.data
      // 设置商品列表
      self.setGoodsList(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取自定义(推荐、会员、特价、常购、优选)商品列表
  getAutoGoodsList () {
    let self = this
    let data = {
      Datatype: self.data.Datatype,
      Classid: self.data.Classid,
      Page: self.data.page,
      pageSize: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.info.getProductList(data).then(result => {
      let res = result.data
      // 设置商品列表
      self.setGoodsList(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取秒杀商品列表
  getPanicBuyGoodsList () {
    let self = this
    let data = {}
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.info.getProductListByPromote(data).then(result => {
      let res = result.data
      // 设置商品列表
      self.setGoodsList(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取轮播图(分类)商品列表
  getCodeGoodsList () {
    let self = this
    let data = {
      Classcode: self.data.Classcode,
      Page: self.data.page,
      Count: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.info.getProductListByCateCode(data).then(result => {
      let res = result.data
      // 设置商品列表
      self.setGoodsList(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取搜索商品列表
  getSearchGoodsList () {
    let self = this
    let data = {
      Sname: self.data.Sname,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
      Page: self.data.page,
      pageSize: self.data.count,
      barcode: '',
      Scode: '',
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.info.getProductListByshortcode(data).then(result => {
      let res = result.data
      // 设置商品列表
      self.setGoodsList(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置商品列表
  setGoodsList (res) {
    let self = this
    if (res.flag === 1) {
      let goodsList = self.data.goodsList
      goodsList.push(...res.data)
      self.setData({
        goodsList: goodsList,
        rowCount: res.rowCount
      })
    } else {
      toast.toast(res.message)
    }
    wx.hideLoading()
    // 设置请求开关
    self.setData({
      getFlag: true
    })
  },

  // 添加购物车
  addCart (e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    // 判断是否散称
    if (goods.scaleflag) {
      self.setData({
        dialogFlag: true,
        goods: goods,
      })
    } else {
      // 调用子组件添加购物车方法
      self.componentAddCart(goods)
    }
  },

  // 调用子组件添加购物车方法
  componentAddCart (goods) {
    let self = this
    let addcart = self.selectComponent('#addCart')
    // 调用子组件，传入商品信息添加购物车
    addcart.addCart(goods)
  },

  // 弹窗关闭
  dialogClose () {
    let self = this
    self.setData({
      dialogFlag: false,
      goods: '',
    })
  },

  // 弹窗确认
  dialogConfirm (goods) {
    let self = this
    // 调用子组件添加购物车方法
    self.componentAddCart(goods.detail)
    self.dialogClose()
  },

  // 更新购物车数量
  getCartCount () {
    let self = this
    let data = {}
    API.bill.getCarProductCount(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data) {
          self.setData({
            cartCount: res.data.data
          })
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
