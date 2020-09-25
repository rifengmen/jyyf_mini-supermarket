// pages/editorOrder/editorOrder.js
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
    // 收货方式开关
    pickTypeFlag: false,
    // 收货方式,0:自提;1:配送
    pickType: 0,
    // 收货地址
    address: '',
    // 订单详情
    orderDetail: '',
    // 储值卡支付方式开关
    paymode3Flag: false,
    // 优惠券支付方式开关
    paymode4Flag: false,
    // 积分抵扣支付方式开关
    paymode5Flag: false,
    // 微信支付方式开关
    paymode7Flag: false,
    // 订单商品数量
    orderCount: 999,
    // 购物车列表
    cartList: [],
    // 订单备注
    remark: '',
    // 只能自提标识
    onlyFlag: false,
    // 积分
    score: '',
    // 积分抵扣金额
    useScoreMoney: 0,
    // 积分使用开关
    scoreFlag: false,
    // 优惠券
    tick: '',
    // 运费
    freight: '',
    // 订单支付金额
    payMoney: 0,
    // 卡支付密码
    password: '',
    // 卡支付密码弹框
    passwordFlag: false,
    // 密码
    pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
    // focusFlag input框获取焦点开关
    focusFlag: false,
    // 点击的按钮
    frombtn: '',
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
      address: app.globalData.address,
    })
    let address = app.globalData.address
    if (!address) {
      // 获取订单详情
    self.getOrderDetail()
    // 获取购物车列表
    self.getCartList()
    }
    // 获取优惠券信息
    self.getTick()
    // 获取收货地址
    self.getAddress()
    // 获取运费
    self.getFreight()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    self.setData({
      pickTypeFlag: false,
      tick: '',
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
    app.globalData.address = ''
    app.globalData.addressId = ''
    app.globalData.tick = ''
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
  onShareAppMessage: function () {

  },

  // 获取订单详情
  getOrderDetail () {
    let self = this
    let data = {}
    request.http('bill/shoppingcar.do?method=buyend', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderDetail = res.data
        let paymodelist = res.data.Paymodelist
        self.setData({
          orderDetail: orderDetail,
          paymode3Flag: (paymodelist.filter(item => item.paymodeid === 3).length ? true : false),
          paymode4Flag: (paymodelist.filter(item => item.paymodeid === 4).length ? true : false),
          paymode5Flag: (paymodelist.filter(item => item.paymodeid === 5).length ? true : false),
          paymode7Flag: (paymodelist.filter(item => item.paymodeid === 7).length ? true : false),
        })
        if (res.data.sendId > 0) {
          if (!app.globalData.address) {
            app.globalData.addressId = res.data.sendId
          }
          // 获取收货地址
          self.getAddress()
        } else if (!res.data.sendId) {
          // 只能自提
          self.setData({
            onlyFlag: true,
          })
        }
        // 获取收货地址
        self.getAddress()
        // 获取运费
        self.getFreight()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取可用积分
  getScore () {
    let self = this
    let data = {
      payMoney: parseFloat(self.data.payMoney),
      Totalmoney: self.data.orderDetail.totalmoney + self.data.freight.freight,
    }
    self.setData({
      scoreFlag: false,
      useScoreMoney: 0,
    })
    request.http('bill/pay.do?method=payMoneyjf', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          score: res.data,
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取优惠券信息
  getTick () {
    let self = this
    let tick = app.globalData.tick
    if (tick) {
      self.setData({
        tick: tick,
      })
      // 获取可用积分
      self.getScore()
    }
    // 设置订单支付金额
    self.setPayMoney()
  },

  // 获取购物车列表
  getCartList () {
    let self = this
    let data = {}
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http('bill/shoppingcar.do?method=listMyCar', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cartList: res.data.carList,
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取收货地址
  getAddress () {
    let self = this
    let addressId = app.globalData.addressId
    if (addressId) {
      let data = {
        addressid: addressId,
      }
      request.http('system/myuser.do?method=listAddressInfo', data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          let address = res.data[0]
          address.pickType = 1
          self.setData({
            address: address
          })
          app.globalData.address = address
        } else {
          toast.toast(res.message)
        }
      }).catch(error => {
        toast.toast(error.error)
      })
    }
  },

  // 获取运费
  getFreight () {
    let self = this
    let data = {
      sendId: app.globalData.addressId,
      Paymode: 0,
      Actmoney: self.data.orderDetail.actmoney,
    }
    request.http('bill/shoppingcar.do?method=getFreight', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          freight: res.data,
        })
      } else {
        toast.toast(res.message)
      }
      // 设置订单支付金额
      self.setPayMoney()
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 去优惠券列表
  toTickList () {
    let self = this
    if (!self.data.address) {
      toast.toast('请先选择收货地址')
      return false
    }
    wx.navigateTo({
      url: '/pages/tickList/tickList?from=editorOrder&payMoney=' + self.data.payMoney + '&Totalmoney=' + self.data.orderDetail.totalmoney,
    })
  },

  // 设置订单备注
  setRemark (e) {
    let self = this
    self.setData({
      remark: e.detail.value,
    })
  },

  // 设置收货方式开关
  setPickTypeFlag () {
    let self = this
    self.setData({
      pickTypeFlag: !self.data.pickTypeFlag
    })
  },

  // 阻止冒泡,空方法
  setStop () {},

  // 设置收货方式
  setPickType (e) {
    let self = this
    self.setData({
      pickType: parseInt(e.detail.value)
    })
  },

  // 收货方式下一步
  nextBtn () {
    let self = this
    if (self.data.pickType) {
      wx.navigateTo({
        url: '/pages/userInfo/addressList/addressList?from=' + 'editorOrder',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userInfo/selfPickUp/selfPickUp',
      })
    }
  },

  // 设置积分使用开关
  setScoreFlag (e) {
    let self = this
    let scoreFlag = self.data.scoreFlag
    let score = self.data.score
    if (scoreFlag) {
      self.setData({
        scoreFlag: false,
        useScoreMoney: 0
      })
    } else {
      self.setData({
        scoreFlag: true,
        useScoreMoney: score.Money,
      })
    }
    // 设置订单支付金额
    self.setPayMoney()
  },

  // 设置订单支付金额
  setPayMoney () {
    let self = this
    // 商品总金额
    let totalMoney = self.data.orderDetail.totalmoney
    // 积分抵扣金额
    let useScoreMoney = self.data.useScoreMoney
    // 运费
    let freight = self.data.freight.freight
    // 优惠券
    let tickMoney = self.data.tick.paymoney || ''
    self.setData({
      payMoney: (totalMoney - useScoreMoney - (tickMoney || 0) + freight).toFixed(2)
    })
    if (!self.data.scoreFlag) {
      // 获取可用积分
      self.getScore()
    }
  },

  // 验证支付信息完整以及是否调用密码弹框
  payVerify (e) {
    let self = this
    let address = app.globalData.address || ''
    let from = e.currentTarget.dataset.from
    self.setData({
      frombtn: from,
    })
    // 获取支付按钮
    let wechatBtn = self.selectComponent('#wechatBtn')
    // 验证收货地址
    if (!address) {
      toast.toast('请选择收货地址')
      return false
    }
    if (from === 'card' || self.data.scoreFlag || self.data.tick) {
      self.setData({
        passwordFlag: true,
      })
      return false
    }
    // 支付
    wechatBtn.pay()
  },

  // 设置密码弹框开关
  setPasswordFlag () {
    let self = this
    self.setData({
      passwordFlag: !self.data.passwordFlag,
      password: '',
      pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
    })
  },

  // stops 阻止冒泡
  stops () {},

  // input框获取焦点
  focusInput () {
    let self = this
    self.setData({
      focusFlag: !self.data.focusFlag,
    })
  },

  // input框失去焦点
  blurInput () {
    let self = this
    self.setData({
      focusFlag: false,
    })
  },

  // 设置密码
  setPassword (e) {
    let self = this
    let _password = e.detail.value
    self.setData({
      password: _password,
    })
    _password = _password.split('')
    if (_password.length) {
      let pd = self.data.pd
      for (let i = 0; i < 6; i++) {
        if (_password[i]) {
          pd[i].password = '*'
          self.setData({
            pd: pd
          })
        } else {
          pd[i].password = ''
          self.setData({
            pd: pd
          })
        }
      }
    } else {
      self.setData({
        pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
      })
    }
  },

  // 密码框确认
  confirmBtn () {
    let self = this
    // 获取支付按钮
    let cardBtn = self.selectComponent('#cardBtn')
    let wechatBtn = self.selectComponent('#wechatBtn')
    let password = self.data.password
    let from = self.data.frombtn
    if (password.length < 6) {
      toast.toast('请输入支付密码')
      return false
    }
    if (from === 'card') {
      // 支付
      cardBtn.pay()
    } else if (from === 'wechat') {
      // 支付
      wechatBtn.pay()
    }

  },

})
