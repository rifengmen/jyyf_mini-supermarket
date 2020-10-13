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
    // 门店名称
    deptname: '',
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
  onShareAppMessage: function () {

  },

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
    request.http('bill/shoppingcar.do?method=listMyCar', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        let cartList = res.data.carList
        if (cartList.length) {
          cartList.forEach(val => {
            val.flag = false
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
      cartList.forEach(val => {
        val.flag = false
      })
      self.setData({
        allFlag: !allFlag,
        cartList: cartList,
      })
    } else {
      cartList.forEach(val => {
        val.flag = true
      })
      self.setData({
        allFlag: !allFlag,
        cartList: cartList,
      })
    }
  },

  // 选中商品/不选商品
  setFlag(e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let cartList = self.data.cartList
    let flag = cartList[index].flag
    let allFlag = self.data.allFlag
    let _allFlag = true
    cartList[index].flag = !flag
    cartList.forEach(val => {
      if (!val.flag) {
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
    cartList.forEach(val => {
      if (val.flag) {
        let del = {
          gdscode: val.Gdscode,
          Xuhao: val.xuhao,
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
    let index = e.currentTarget.dataset.index
    // 购物车数量操作
    self.editorCartCount('addCart', index)
  },

  // 购物车减得方法
  subtrackCart(e) {
    let self = this
    let index = e.currentTarget.dataset.index
    // 购物车数量操作
    self.editorCartCount('subtrackCart', index)
  },

  // 弹窗关闭
  dialogClose() {
    let self = this
    self.setData({
      dialogFlag: false,
      dialogJin: '',
      dialogLiang: '',
      dialogCount: '',
      dialogTotalMoney: '',
    })
  },

  // 弹窗确认
  dialogConfirm() {
    let self = this
    let goods = self.data.goods
    let data = {
      Gdscode: goods.Gdscode,
      Xuhao: goods.xuhao,
      Count: self.data.dialogCount,
    }
    // 修改购物车商品数量的方法
    self.updateIntoCar(data)
    // 关闭弹窗
    self.dialogClose()
    // {"Gdscode":"2000013200","Count":5,"Xuhao":9}
  },

  // 设置弹窗斤
  setDialogJin(e) {
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
  setDialogLiang(e) {
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
  setDialogCount() {
    let self = this
    self.setData({
      dialogCount: (self.data.dialogJin / 2 + self.data.dialogLiang / 20).toFixed(2)
    })
  },

  // 设置弹窗金额
  setDialogTotalMoney() {
    let self = this
    self.setData({
      dialogTotalMoney: (self.data.dialogPrice * self.data.dialogCount).toFixed(2)
    })
  },

  // 购物车数量操作
  editorCartCount(method, index) {
    let self = this
    let cartList = self.data.cartList
    // 判断是否为标签商品
    if (cartList[index].striperbarcodeflag === 1) {
      toast.toast('称签商品不允许修改数量')
    } else {
      let Count = cartList[index].buyAMT
      let Xuhao = cartList[index].xuhao
      let Gdscode = cartList[index].Gdscode
      let saleflag = cartList[index].scaleflag
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
        let goods = cartList[index]
        self.setData({
          goods: goods,
          dialogFlag: true,
          dialogTitle: goods.Pname,
          dialogPrice: goods.actualprice,
          dialogJin: Math.floor(goods.buyAMT / 0.5),
          dialogLiang: Math.floor(goods.buyAMT % 0.5 * 20),
          dialogCount: parseFloat(goods.buyAMT).toFixed(2),
          dialogTotalMoney: (goods.buyAMT * goods.actualprice).toFixed(2),
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
    cartList.forEach(val => {
      if (val.Gdscode === data.Gdscode) {
        val.buyAMT = data.Count
      }
    })
    request.http('bill/shoppingcar.do?method=updateIntoCar', data, 'POST').then(result => {
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
      cartList = cartList.filter(item => item.flag === false)
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
    request.http('bill/shoppingcar.do?method=delCars', data, 'POST').then(result => {
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
    request.http('bill/shoppingcar.do?method=getCarProductCount', data, 'POST').then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cartCount: res.data.data
        })
        if (res.data.data) {
          wx.setTabBarBadge({
            index: 2,
            text: (res.data.data).toString()
          })
        } else {
          wx.removeTabBarBadge({
            index: 2
          })
        }
      } else {
        toast.toast(res.message)
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
        url: '/pages/shopBag/shopBag',
      })
    } else {
      wx.navigateTo({
        url: '/pages/editorOrder/editorOrder',
      })
    }
  },

})
