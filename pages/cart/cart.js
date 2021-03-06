// pages/cart/cart.js
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 购物车列表
    cartList: [],
    // 购物车数量
    cartCount: 0,
    // 扫码购标识,1扫码购，0非扫码购
    SMGflag: 0,
    // 请求开关
    getFlag: false,
    // 编辑开关
    editorFlag: false,
    // 全选状态
    allFlag: false,
    // 合计金额
    totalMoney: 0.00,
    // 实际支付金额
    actMoney: 0.00,
    // 优惠金额
    discountMoney: 0.00,
    // otc,区分购物车与立即购买now:正常立即购买
    otc: '',
    // isotc,区分拼团砍价的普通立即购买还是活动立即购买
    isotc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 获取购物车列表
    self.getCartList()
    // 更新购物车数量
    self.getCartCount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    self.setData({
      allFlag: false,
      editorFlag: false,
      cartList: [],
      totalMoney: 0.00,
      actMoney: 0.00,
      discountMoney: 0.00,
    })
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
    // 获取购物车列表
    self.getCartList()
    // 更新购物车数量
    self.getCartCount()
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取购物车列表
  getCartList() {
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
    API.bill.listMyCar(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data && res.data.carList) {
          let cartList = res.data.carList
          if (cartList.length) {
            cartList.forEach(item => {
              item.Defaultimage = item.Pimg
              item.Name = item.Pname
              item.Highpprice = item.actualprice
              item.Highoprice = item.saleprice
              item.check = false
            })
            self.setData({
              SMGflag: res.data.SMGflag
            })
            let countData = {
              cartList: cartList,
              totalmoney: res.data.totalmoney,
              actmoney: res.data.actmoney
            }
            // 购物车重新计算
            self.countCart(countData)
          }
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

  // 全选/不选
  radioChange() {
    let self = this
    let allFlag = self.data.allFlag
    let cartList = self.data.cartList
    if (allFlag) {
      cartList.forEach(item => {
        item.check = false
      })
      self.setData({
        allFlag: !allFlag,
        cartList: cartList,
      })
    } else {
      cartList.forEach(item => {
        item.check = true
      })
      self.setData({
        allFlag: !allFlag,
        cartList: cartList,
      })
    }
  },

  // 选中商品/不选商品
  setCheck(e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let cartList = self.data.cartList
    let check = cartList[index].check
    let allFlag = self.data.allFlag
    let _allFlag = true
    cartList[index].check = !check
    cartList.forEach(item => {
      if (!item.check) {
        _allFlag = false
      }
    })
    allFlag = _allFlag
    self.setData({
      cartList: cartList,
      allFlag: allFlag,
    })
  },

  // 编辑购物车
  editorCartList() {
    let self = this
    let editorFlag = self.data.editorFlag
    self.setData({
      editorFlag: !editorFlag
    })
  },

  // 删除按钮
  deleteBtn() {
    let self = this
    let cartList = self.data.cartList
    let delList = []
    cartList.forEach(item => {
      if (item.check) {
        let del = {
          gdscode: item.Gdscode,
          Xuhao: item.xuhao,
        }
        delList.push(del)
      }
    })
    // 验证是否存在选中商品
    if (!delList.length) {
      toast('请选择要删除的商品')
      return false
    }
    // 确认弹窗
    wx.showModal({
      title: '提示',
      content: '您确定要删除这些商品吗？',
      success: res => {
        // 确认
        if (res.confirm) {
          // 删除商品的方法
          self.delCars(delList)
        }
      }
    })
  },

  // 设置购物车
  setCartList(e) {
    let self = this
    let cartdesc = e.detail
    let cartList = self.data.cartList
    cartList.forEach(item => {
      if (item.xuhao === cartdesc.Xuhao && item.Gdscode === cartdesc.Gdscode) {
        item.buyAMT = cartdesc.Count
      }
    })
    let countData = {
      cartList: cartList,
      totalmoney: cartdesc.totalmoney,
      actmoney: cartdesc.actmoney,
    }
    // 购物车重新计算
    self.countCart(countData)
  },

  // 删除购物车商品的方法
  delCars(delList) {
    let self = this
    let cartList = self.data.cartList
    // 过滤出未选中的商品
    cartList = cartList.filter(item => item.check === false)
    let data = {
      gdss: delList
    }
    if (!cartList.length) {
      // 设置请求开关
      self.setData({
        getFlag: true
      })
    }
    API.bill.delCars(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let countData = {
          cartList: cartList,
          totalmoney: res.data.totalmoney,
          actmoney: res.data.actmoney,
        }
        // 购物车重新计算
        self.countCart(countData)
      }
      toast(res.message)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 购物车重新计算
  countCart(countData) {
    let self = this
    if (countData.cartList.length) {
      self.setData({
        cartList: countData.cartList || [],
        totalMoney: countData.totalmoney || 0,
        actMoney: (countData.actmoney).toFixed(2) || 0,
        discountMoney: (countData.totalmoney - countData.actmoney).toFixed(2) || 0
      })
    } else {
      self.setData({
        cartList: [],
        totalMoney: 0,
        actMoney: 0,
        discountMoney: 0
      })
    }
    // 更新购物车
    self.getCartCount()
  },

  // 更新购物车
  getCartCount() {
    let self = this
    let data = {}
    API.bill.getCarProductCount(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let index = 3
        if (res.data) {
          self.setData({
            cartCount: res.data.data
          })
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
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 去结算
  toBuyEnd() {
    let self = this
    let buyEnd = self.selectComponent('#buyEnd')
    let goods = {
      otc: '',
      isotc: '',
      orderType: '',
      Gdscode: '',
      amount: '',
    }
    // 调用子组件，传入商品信息
    buyEnd.toBuyEnd(goods)
  },

})
