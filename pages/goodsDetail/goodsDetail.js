// pages/goodsDetail/goodsDetail.js
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
    // 抢购商品详情
    goodsDetail2: '',
    // evaluation 好评率
    evaluation: 100,
    // 富文本
    describe: '',
    // 轮播点儿下标
    swiperCurrent: 0,
    // 评价列表
    commentList: [],
    // 购物车数量
    cartCount: 0,
    // 弹框组件显示开关
    dialogFlag: false,
    // 商品信息
    goods: '',
    // 抢购单号
    panicbuycode: '',
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
      title: options.title,
      panicbuycode: options.panicbuycode,
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
    let data = ''
    let url = ''
    if (self.data.panicbuycode) {
      data = {
        Gdscode: self.data.Gdscode,
        panicbuycode: self.data.panicbuycode
      }
      url = 'info/panicGdscode.do?method=getPanicBuyGdscode'
    } else {
      data = {
        Gdscode: self.data.Gdscode,
        Utype: self.data.Utype,
        Deptcode: self.data.deptcode
      }
      url = 'info/goods.do?method=getProductDetails'
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    request.http(url, data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let EvaluationGC = ''
        let EvaluationTC = ''
        let evaluation = ''
        if (!self.data.panicbuycode) {
          EvaluationGC = res.data.EvaluationGC
          EvaluationTC = res.data.EvaluationTC
          evaluation = (((EvaluationGC / EvaluationTC).toFixed(4) || 1) * 100)
        }
        self.setData({
          goodsDetail: res.data,
          evaluation: evaluation,
        })
        // 渲染富文本内容
        self.setDescribe()
        if (self.data.panicbuycode) {
          // 获取抢购商品详情
          self.getGoodsDetail2()
        }
      } else {
        toast.toast(res.message)
      }
      wx.hideLoading()
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取抢购商品详情
  getGoodsDetail2 () {
    let self = this
    let data = {
      Gdscode: self.data.Gdscode,
      Utype: self.data.Utype,
      Deptcode: self.data.deptcode
    }
    // 验证是否抢购商品
    if (!self.data.panicbuycode) {
      return false
    }
    request.http('info/goods.do?method=getProductDetails', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let goodsDetail = self.data.goodsDetail
        let goodsDetail2 = res.data
        goodsDetail.placeoforigin = goodsDetail.Placeoforigin
        goodsDetail.cumulativesales = goodsDetail2.cumulativesales
        goodsDetail.deptstock = goodsDetail2.deptstock
        goodsDetail.sendstock = goodsDetail2.sendstock
        goodsDetail.EvaluationGC = res.data.EvaluationGC
        goodsDetail.EvaluationTC = res.data.EvaluationTC
        let EvaluationGC = res.data.EvaluationGC
        let EvaluationTC = res.data.EvaluationTC
        let evaluation = (((EvaluationGC / EvaluationTC).toFixed(4) || 1) * 100)
        self.setData({
          goodsDetail: goodsDetail,
          evaluation: evaluation
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 渲染富文本内容
  setDescribe () {
    let self = this
    let describe = self.data.goodsDetail.describe || ''
    let baseUrl = self.data.baseUrl
    if (describe) {
      describe = describe.replace(/upload\/images/g, (baseUrl + 'upload/images')).replace(/\<img/g, '<img style="max-width:100%;height:auto;display:block;float:left;margin: 0 auto"')
    }
    self.setData({
      describe: describe
    })
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
    let goods = e.currentTarget.dataset.goods
    // 判断抢购
    if (self.data.panicbuycode) {
      goods.Highpprice = goods.panicprice
    } else {
      goods.Highpprice = goods.preferential
      goods.Gdscode = goods.gdscode
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
