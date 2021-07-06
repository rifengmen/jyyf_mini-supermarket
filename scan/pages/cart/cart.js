// scan/pages/cart/cart.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 打开摄像头方式，1：页面打开时打开；2：点击扫一扫按钮打开
    type: '',
    // 购物车
    scanCart: [],
    // 购物袋列表
    shopBagList: [],
    // 扫码购店铺
    scanShopInfo: '',
    // 商品条码
    goodscode: '',
    // 商品信息
    goodsInfo: '',
    // 商品信息弹窗开关
    goodsInfoFlag: false,
    // 商品总价
    totalmoney: 0,
    // 编辑开关
    editflag: false,
    // 流水号
    flowno: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      type: parseFloat(options.type),
      scanShopInfo: app.globalData.scanShopInfo,
    })
    if (self.data.type === 1) {
      // 扫一扫
      self.scangoodscode()
    }
    // 获取购物袋列表
    self.getShopBagList()
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
      scanCart: app.globalData.scanCart,
    })
    // 计算商品总价
    self.setTotalmoney()
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取购物袋列表
  getShopBagList() {
    let self = this
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    let data = {}
    API.bill.getShoppingBagList(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let shopBagList = res.data.shoppingbaglist
        if (shopBagList.length) {
          shopBagList.forEach(item => {
            item.quantity = 0
            item.salePrice = item.saleprice
            item.actualPrice = item.memprice
            item.productCode = item.goodscode
          })
          self.setData({
            shopBagList: shopBagList,
          })
        }
      } else {
        toast(res.message)
      }
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
    }).catch(error => {
      toast(error.error)
    })
  },

  // 购物袋数量操作
  updateShopBag(e) {
    let self = this
    let { goods, types } = e.currentTarget.dataset
    let shopBagList = self.data.shopBagList
    shopBagList.forEach(item => {
      if (item.goodscode === goods.goodscode) {
        // 判断加减
        if (types === 'add') {
          item.quantity++
        } else if (types === 'subtrack') {
          if (item.quantity <= 0) {
            item.quantity = 0
            return false
          } else {
            item.quantity--
          }
        }
      }
    })
    self.setData({
      shopBagList: shopBagList
    })
    // 计算商品总价
    self.setTotalmoney()
  },

  // 扫一扫
  scangoodscode() {
    let self = this
    // // 验证是否绑定手机号码
    // if (!app.bindmobileFlag()) {
    //   wx.switchTab({
    //     url: '/pages/userInfo/userInfo',
    //   })
    //   toast('请注册绑定手机号码')
    //   return false
    // }
    wx.scanCode({
      success(res) {
        // 扫码后获取结果参数赋值给Input
        let result = res.result
        if (result) {
          // 订单号码
          self.setData({
            goodscode: result
          })
          // 获取商品信息
          self.getGoodsInfo()
        } else {
          toast('请对准条形码扫码')
        }
      }
    })
  },

  // 获取商品信息
  getGoodsInfo() {
    let self = this
    let data = {
      barcode: self.data.goodscode,
      deptcode: self.data.scanShopInfo.deptcode
    }
    API.invest.getProductDetailsByBarcode(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          goodsInfo: res.data,
          goodsInfoFlag: true,
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 加入返回
  addBack() {
    let self = this
    // 加入购物车
    self.addScancart()
    // 关闭购物车弹窗
    self.cancel()
  },

  // 加入继续
  addGoOn() {
    let self = this
    // 加入购物车
    self.addScancart('goOn')
    // 关闭购物车弹窗
    self.cancel()
  },

  // 加入购物车
  addScancart(goOn) {
    let self = this
    // 扫码购购物车操作,goods:商品信息;types:操作方法(add:加，count:减)
    app.setScanCart(self.data.goodsInfo, 'add')
    self.setData({
      scanCart: app.globalData.scanCart,
    })
    // 计算商品总价
    self.setTotalmoney()
    if (goOn === 'goOn') {
      // 扫一扫
      self.scangoodscode()
    }
  },

  // 关闭购物车弹窗
  cancel() {
    let self = this
    self.setData({
      goodsInfoFlag: false,
    })
  },

  // 修改购物车数量
  updateAmount(e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    let types = e.currentTarget.dataset.types
    // 扫码购购物车操作,goods:商品信息;types:操作方法(add:加，count:减)
    app.setScanCart(goods, types)
    self.setData({
      scanCart: app.globalData.scanCart
    })
    // 计算商品总价
    self.setTotalmoney()
  },

  // 设置编辑开关
  setEditflag() {
    let self = this
    self.setData({
      editflag: !self.data.editflag
    })
  },

  // 删除购物车商品
  delBtn(e) {
    let self = this
    let { goods, gindex } = e.currentTarget.dataset
    let scanCart = self.data.scanCart
    scanCart = scanCart.filter((item, index) => index !== gindex)
    app.globalData.scanCart = scanCart
    self.setData({
      scanCart: scanCart
    })
    // 计算商品总价
    self.setTotalmoney()
  },

  // 清空购物车
  clearBtn() {
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定清空购物车吗？',
      success: res => {
        // 确认
        if (res.confirm) {
          app.globalData.scanCart = []
          self.setData({
            scanCart: []
          })
          // 计算商品总价
          self.setTotalmoney()
        }
      }
    })
  },

  // 计算商品总价
  setTotalmoney() {
    let self = this
    let totalmoney = 0
    let scanCart = self.data.scanCart
    let shopBagList = self.data.shopBagList
    let cart = []
    // 商品、购物袋合计
    cart.push(...scanCart, ...shopBagList)
    cart.forEach(item => {
      let _money
      if (item.scalageScanProduct) {
        _money = parseFloat(item.actualSaleMoney)
      } else {
        _money = parseFloat(item.actualPrice) * item.quantity
      }
      totalmoney += _money
    })
    self.setData({
      totalmoney: totalmoney.toFixed(2),
    })
  },

  // 去结算
  setTlement() {
    wx.showLoading({
      title: '请求等待中...',
      mask: true,
    });
    let self = this
    let scanShopInfo = self.data.scanShopInfo
    // 购物袋加入购物车
    let shopBagList = self.data.shopBagList.filter(item => item.quantity)
    let productList = []
    productList.push(...self.data.scanCart, ...shopBagList)
    // 判断购物车存在商品
    if (!productList.length) {
      toast('请添加商品')
      return false
    }
    let goodsList = productList.map(item => {
      return {
        productCode: item.productCode,
        bagflag: item.bagflag || '',
        quantity: item.quantity,
        actualPrice: item.actualPrice,
        scalageScanProduct: item.scalageScanProduct,
        barcode: item.barcode,
        limitamount: item.limitamount || '',
        salePrice: item.salePrice,
      }
    })
    let data = {
      productList: goodsList,
      deptcode: scanShopInfo.deptcode
    }
    API.invest.saveFlow(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          flowno: res.data.flowno,
          scanCart: [],
        })
        app.globalData.scanCart = []
        wx.redirectTo({
          url: '/scan/pages/editorOrder/editorOrder?deptcode=' + scanShopInfo.deptcode + '&deptname=' + scanShopInfo.deptname + '&flowno=' + self.data.flowno
        })
      } else {
        toast(res.message)
      }
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading()
      toast(error.error)
    })
  },
})
