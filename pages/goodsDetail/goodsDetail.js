// pages/goodsDetail/goodsDetail.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")
const WxParse = require('../../wxParse/wxParse')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 商品id
    Gdscode: '',
    // EType,评论类型（0全部，好评1，中评2，差评3）
    EType: 0,
    // title
    title: '',
    // 会员类型，1：批发；2：普通
    Utype: 2,
    // 商品详情
    goodsDetail: '',
    // 轮播点儿下标
    swiperCurrent: 0,
    // 评价列表
    commentList: [],
    // 购物车数量
    cartCount: 0,
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
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode,
      Gdscode: options.Gdscode,
      title: options.title
    })
    // 设置title
    wx.setNavigationBarTitle({
      title: self.data.title,
    })
    // 获取商品详情
    self.getGoodsDetail()
    // 获取商品评价列表
    self.getGoodsCommentList()
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
    // 获取商品详情
    self.getGoodsDetail()
    // 获取商品评价列表
    self.getGoodsCommentList()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
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

  // 获取商品详情
  getGoodsDetail () {
    let self = this
    let data = {
      Gdscode: self.data.Gdscode,
      Utype: self.data.Utype,
      Deptcode: self.data.deptcode
    }
    request.http('info/goods.do?method=getProductDetails', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          goodsDetail: res.data
        })
        // 渲染富文本内容
        self.setDescribe()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 渲染富文本内容
  setDescribe () {
    let self = this
    let describe = self.data.goodsDetail.describe
    let baseUrl = self.data.baseUrl
    describe = describe.replace(/upload\/images/g, (baseUrl + 'upload/images'))
    WxParse.wxParse('describe', 'html', describe, self, 5)
  },

  // 获取商品评价列表
  getGoodsCommentList () {
    let self = this
    let data = {
      gdscode: self.data.Gdscode,
      EType: self.data.EType,
    }
    request.http('bill/evaluation.do?method=getProductEvaluation', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.length) {
          self.setData({
            commentList: res.data.slice(0,3)
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 修改轮播点儿
  swiperChange (e) {
    let self = this
    self.setData({
      swiperCurrent: e.detail.current
    })
  },

  // 设置常购
  setOften () {
    let self = this
    let goodsDetail = self.data.goodsDetail
    let Otype = 1
    if (goodsDetail.alwaysbuyflag) {
      Otype = 2
    } else {
      Otype = 1
    }
    let data = {
      Otype: Otype,
      Gdsinf: [{'gdscode': self.data.Gdscode}],
    }
    request.http('info/goods.do?method=addAlwaysBuyProduct', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        goodsDetail.alwaysbuyflag = !goodsDetail.alwaysbuyflag
        self.setData({
          goodsDetail: goodsDetail
        })
      }
      toast.toast(res.message)
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
    goods.Gdscode = goods.gdscode
    goods.Highpprice = goods.preferential
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
    request.http('bill/shoppingcar.do?method=getCarProductCount', data).then(result => {
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
