// shopping/pages/goodsList/goodsList.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 是否显示下拉提示
    isPullDownShow: false,
    // 下拉刷新提示文字
    pullDownText: true,
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
    // 活动类别
    promotemode: '',
    // title
    title: '',
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 页数
    page: 1,
    // 每页条数
    count: 16,
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
    // 页面滚动开关
    scrollflag: false,
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
      promotemode: options.promotemode || '',
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
    // 设置滚动开关
    self.setScrollflag()
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
    // 清除倒计时
    clearInterval(self.data.time)
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
      toast('暂无更多')
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

  /**
   * 监听页面滚动
   */
  onPageScroll (e) {
    let self = this
    let scrollflag = self.data.scrollflag
    if (!scrollflag) {
      self.setData({
        scrollflag: true
      })
    }
  },

  // 设置滚动开关
  setScrollflag () {
    let self = this
    self.data.time = setInterval(() => {
      self.setData({
        scrollflag: false
      })
    }, 2000)
  },

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
      // 获取拼团、秒杀、砍价、预售商品列表
      self.getPanicBuyGoodsList(self.data.promotemode)
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
      toast(error.error)
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
      toast(error.error)
    })
  },

  // 获取拼团、秒杀、砍价商品列表
  getPanicBuyGoodsList (promotemode) {
    let self = this
    let data = {
      promotemode: promotemode,
      Page: 1,
      pageSize: 15,
    }
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
      toast(error.error)
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
      toast(error.error)
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
      toast(error.error)
    })
  },

  // 设置商品列表
  setGoodsList (res) {
    let self = this
    if (res.flag === 1) {
      let goodsList = self.data.goodsList
      // 商品code统一字段
      let list = res.data
      list.forEach(item => {
        if (item.goodscode && !item.Gdscode) {
          item.Gdscode = item.goodscode
        }
      })
      goodsList.push(...list)
      self.setData({
        goodsList: goodsList,
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
      toast(error.error)
    })
  },
})
