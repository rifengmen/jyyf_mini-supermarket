// pages/category/category.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    errorImage: app.globalData.errorImage,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 一级分类列表
    level1: [],
    // 选中分类下标
    level1ActiveIndex: 0,
    // 二级分类列表
    level2: [],
    // 选中分类下标
    level2ActiveIndex: 0,
    // 页数
    page: 1,
    // 每页条数
    count: 15,
    // 商品总条数
    rowCount: 0,
    // 排序方式（1销量、2人气、3价格)
    sortflg: 1,
    // 升序降序 (0升序、1降序)
    sorttype: 2,
    // 热门分类标志 默认0
    hotCategoryflag: 0,
    // 商品列表
    goodsList: [],
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
    // 获取一级分类
    self.getLevel1()
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
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode
    })
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
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    // 获取商品列表
    self.getGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 获取一级分类
  getLevel1 () {
    let self = this
    let data = {}
    request.http('system/goodsclass.do?method=listClass', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          level1: res.data
        })
        if (res.data.length) {
          // 获取二级分类
          self.getLevel2()
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取二级分类
  getLevel2 () {
    let self = this
    let index = self.data.level1ActiveIndex
    let level1 = self.data.level1
    let data = {
      classid: level1[index].classid
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http('system/goodsclass.do?method=listSubClass', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          level2: res.data
        })
        if (res.data.length) {
          // 获取商品列表
        self.getGoodsList()
        } else {
          wx.hideLoading()
          // 设置请求开关
          self.setData({
            getFlag: true
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取商品列表
  getGoodsList () {
    let self = this
    let index = self.data.level2ActiveIndex
    let level2 = self.data.level2
    let data = {
      Cateid: level2[index].classid,
      Page: self.data.page,
      Count: self.data.count,
      Sortflg: self.data.sortflg,
      sorttype: self.data.sorttype,
      HotCategoryflag: self.data.hotCategoryflag,
    }
    request.http('info/goods.do?method=getProductListByCate', data).then(result => {
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

  // 设置选中一级分类
  setLevel1ActiveIndex (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    self.setData({
      level1ActiveIndex: index,
      level2ActiveIndex: 0,
      page: 1,
      goodsList: [],
    })
    // 获取二级分类
    self.getLevel2()
  },

  // 设置选中二级分类
  setLevel2ActiveIndex (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    self.setData({
      level2ActiveIndex: index,
      page: 1,
      goodsList: [],
    })
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    // 获取商品列表
    self.getGoodsList()
  },

  // 添加购物车
  addCart (e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    // 判断抢购
    if (goods.panicbuycode) {
      goods.Highpprice = goods.panicprice
    }
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
    let panicBuyaddCart = self.selectComponent('#panicBuyaddCart')
    if (goods.panicbuycode) { // 抢购添加
      // 调用子组件，传入商品信息添加购物车
      panicBuyaddCart.addCart(goods)
    } else { // 普通添加
      // 调用子组件，传入商品信息添加购物车
      addcart.addCart(goods)
    }
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
    request.http('bill/shoppingcar.do?method=getCarProductCount', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let scanType = app.globalData.scanType
        let index = 3
        if (scanType) {
          index = 2
        }
        if (res.data.data) {
          wx.setTabBarBadge({
            index: index,
            text: (res.data.data).toString()
          })
        } else {
          wx.removeTabBarBadge({
            index: index
          })
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
