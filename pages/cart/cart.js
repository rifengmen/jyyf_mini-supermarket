// pages/cart/cart.js
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
    // 弹框组件显示开关
    dialogFlag: false,
    // 商品信息
    goods: '',
    // 合计金额
    totalMoney: 0.00,
    // 实际支付金额
    actMoney: 0.00,
    // 优惠金额
    discountMoney: 0.00,
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
    // 弹窗关闭
    self.dialogClose()
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
    request.http('bill/shoppingcar.do?method=listMyCar', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let cartList = res.data.carList
        if (cartList.length) {
          cartList.forEach(item => {
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
      toast.toast('请选择要删除的商品')
      return false
    }
    // 确认弹窗
    wx.showModal({
      title: '提示',
      content: '您确定要删除这些商品吗？',
      success(res) {
        // 确认按钮执行
        if (res.confirm) {
          // 删除商品的方法
          self.delCars(delList)
        }
      }
    })
  },

  // 购物车加的方法
  addCart(e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    // 购物车数量操作
    self.editorCartCount('addCart', goods)
  },

  // 购物车减得方法
  subtrackCart(e) {
    let self = this
    let goods = e.currentTarget.dataset.goods
    // 购物车数量操作
    self.editorCartCount('subtrackCart', goods)
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
  dialogConfirm(goods) {
    let self = this
    let data = {
      Gdscode: goods.detail.Gdscode,
      Xuhao: goods.detail.xuhao,
      Count: goods.detail.count,
    }
    // 修改购物车商品数量的方法
    self.updateIntoCar(data)
    // 关闭弹窗
    self.dialogClose()
  },

  // 购物车数量操作
  editorCartCount(method, goods) {
    let self = this
    let cartList = self.data.cartList
    // 判断是否为标签商品
    if (goods.striperbarcodeflag === 1) {
      toast.toast('称签商品不允许修改数量')
    } else {
      let Count = goods.buyAMT
      let Xuhao = goods.xuhao
      let Gdscode = goods.Gdscode
      let saleflag = goods.scaleflag
      // 判断加减
      if (method === 'addCart') {
        Count++
      } else if (method === 'subtrackCart') {
        if (Count <= 1) {
          let delList = [{gdscode: Gdscode, Xuhao: Xuhao,}]
          // 删除商品
          wx.showModal({
            title: '提示',
            content: '您确定要删除此商品吗？',
            success(res) {
              // 确认按钮执行
              if (res.confirm) {
                // 删除商品的方法
                self.delCars(delList, 'editorCartCount')
              }
            }
          })
        } else {
          Count--
        }
      }
      // 判断商品类型，saleflag：0是非散称，1是散称
      if (saleflag) {
        goods.Name = goods.Pname
        goods.Highpprice = goods.actualprice
        self.setData({
          goods: goods,
          dialogFlag: true,
        })
      } else {
        let data = {
          Gdscode: Gdscode,
          Xuhao: Xuhao,
          Count: Count,
        }
        // 修改购物车商品数量的方法
        self.updateIntoCar(data)
      }
    }
  },

  // 修改购物车商品数量的方法
  updateIntoCar(data) {
    let self = this
    let cartList = self.data.cartList
    cartList.forEach(item => {
      if (item.Gdscode === data.Gdscode) {
        item.buyAMT = data.Count
      }
    })
    request.http('bill/shoppingcar.do?method=updateIntoCar', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let countData = {
          cartList: cartList,
          totalmoney: res.data.totalmoney,
          actmoney: res.data.actmoney,
          goods: '',
        }
        // 购物车重新计算
        self.countCart(countData)
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 删除商品的方法
  delCars(delList, flag) {
    let self = this
    let cartList = self.data.cartList
    // 判断是删除按钮调用还是修改数量调用，flag：有值就是修改数量调用，否则为删除按钮
    if (flag) {
      cartList = cartList.filter(item => item.Gdscode !== delList[0].gdscode)
    } else {
      // 过滤出未选中的商品
      cartList = cartList.filter(item => item.check === false)
    }
    let data = {
      gdss: delList
    }
    if (!cartList.length) {
      // 设置请求开关
      self.setData({
        getFlag: true
      })
    }
    request.http('bill/shoppingcar.do?method=delCars', data).then(result => {
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
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.error)
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
    request.http('bill/shoppingcar.do?method=getCarProductCount', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let scanType = app.globalData.scanType
        let index = 3
        if (scanType) {
          index = 2
        }
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
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 去编辑订单页面
  toEditorOrder() {
    let self = this
    if (self.data.SMGflag) {
      wx.navigateTo({
        url: '/scan/pages/shopBag/shopBag',
      })
    } else {
      wx.navigateTo({
        url: '/pages/editorOrder/editorOrder',
      })
    }
  },

})
