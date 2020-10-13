const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

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
    goodsList: [],
    // 购物车数量
    cartCount: 0,
    // 请求开关
    getFlag: false,
    // 弹框组件显示开关
    dialogFlag: false,
    // 弹窗title
    dialogTitle: '',
    // 弹窗价格
    dialogPrice: '',
    // 弹窗斤
    dialogJin: '',
    // 弹窗两
    dialogLiang: '',
    // 弹窗重量
    dialogCount: '',
    // 弹窗合计金额
    dialogTotalMoney: '',
    // 商品信息
    goods: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      // 分类
      cateid: options.cateid || '',
      // 自定义区
      datatype: options.Datatype || '',
      // 抢购
      panicBuy: options.panicBuy || '',
      // 轮播图
      classCode: options.classCode || '',
      // 搜索
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
  onShareAppMessage: function () {

  },

  // 请求对应商品列表
  sendMethods () {
    let self= this
    if (self.data.datatype) {
      // 获取自定义商品列表
      self.getAutoGoodsList()
    } else if (self.data.panicBuy) {
      // 获取抢购商品列表
      self.getPanicBuyGoodsList()
    } else if (self.data.classCode) {
      // 获取轮播图商品列表
      self.getCodeGoodsList()
    } else if (self.data.sname) {
      // 获取搜索商品列表
      self.getSearchGoodsList()
    } else if (self.data.cateid) {
      // 获取分类商品列表
      self.getGoodsList()
    }
  },

  // 获取分类商品列表
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
      Datatype: self.data.datatype,
      Page: self.data.page,
      pageSize: self.data.count,
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

  // 获取轮播图商品列表
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
    let self = this
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http(url, data).then(result => {
      let res = result.data
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
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 添加购物车
  addCart (e) {
    let self = this
    // 获取添加购物车组件
    let addcart = self.selectComponent('#addCart')
    let goods = e.currentTarget.dataset.goods
    if (self.data.panicBuy) {
      goods.Highpprice = goods.panicprice
    }
    // 判断是否散称
    if (goods.scaleflag) {
      self.setData({
        dialogFlag: true,
        dialogTitle: goods.Name,
        dialogPrice: goods.Highpprice,
        goods: goods,
      })
    } else {
      // 调用子组件，传入商品信息添加购物车
      addcart.addCart(goods)
    }
  },

  // 弹窗取消
  dialogClose () {
    let self = this
    self.setData({
      dialogFlag: false,
      dialogJin: '',
      dialogLiang: '',
      dialogCount: '',
      dialogTotalMoney: '',
      goods: '',
    })
  },

  // 弹窗确认
  dialogConfirm () {
    let self = this
    // 获取添加购物车组件
    let addcart = self.selectComponent('#addCart')
    let goods = self.data.goods
    if (self.data.panicBuy) {
      goods.Highpprice = goods.panicprice
    }
    goods.count = self.data.dialogCount
    // 调用子组件，传入商品信息添加购物车
    addcart.addCart(goods)
    self.dialogClose()
  },

  // 设置弹窗斤
  setDialogJin (e) {
    let self = this
    self.setData({
      dialogJin: e.detail.value
    })
    // 设置弹窗重量
    self.setDialogCount()
    // 设置弹窗金额
    self.setDialogTotalMoney()
  },

  // 设置弹窗两
  setDialogLiang (e) {
    let self = this
    self.setData({
      dialogLiang: e.detail.value
    })
    // 设置弹窗重量
    self.setDialogCount()
    // 设置弹窗金额
    self.setDialogTotalMoney()
  },

  // 设置弹窗重量
  setDialogCount () {
    let self = this
    self.setData({
      dialogCount: (self.data.dialogJin/2 + self.data.dialogLiang/20).toFixed(2)
    })
  },

  // 设置弹窗金额
  setDialogTotalMoney () {
    let self = this
    self.setData({
      dialogTotalMoney: (self.data.dialogPrice * self.data.dialogCount).toFixed(2)
    })
  },

  // 更新购物车数量
  getCartCount () {
    let self = this
    let data = {}
    request.http('bill/shoppingcar.do?method=getCarProductCount', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cartCount: res.data.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
