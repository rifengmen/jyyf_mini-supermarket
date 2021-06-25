// shopping/pages/editorOrder/editorOrder.js
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
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 会员类型，1：批发；2：普通
    Utype: 2,
    // 收货地址
    address: '',
    // 商品code
    goodscode: '',
    // 商品数量
    amount: '',
    // 商品详情,非购物车结算用
    goodsDetail: '',
    // 订单详情
    orderDetail: '',
    // 储值卡支付方式开关
    paymode3Flag: false,
    // 电子券支付方式开关
    paymode4Flag: false,
    // 积分抵扣支付方式开关
    paymode5Flag: false,
    // 微信支付方式开关
    paymode7Flag: false,
    // 订单商品数量
    orderCount: 0,
    // 购物车列表
    cartList: [],
    // 配送时间树
    sendTimeList: [],
    // 配送时间列表
    deliverytimeList: [],
    // 配送时间下标
    deliverytimeIndex: [0, 0],
    // 配送日期
    deliverydate: '',
    // 配送时间
    deliverytime: '',
    // 订单备注
    remark: '',
    // 备注禁用开关
    remarkFlag: false,
    // 积分
    score: '',
    // 积分抵扣金额
    useScoreMoney: 0,
    // 积分使用开关
    scoreFlag: false,
    // 电子券
    tick: '',
    // 电子券可用标识请求开关
    getUseTickflag: true,
    // 电子券可用标识
    isUseTickflag: true,
    // 运费
    freight: '',
    // 订单支付金额
    payMoney: 0,
    // 卡支付密码
    password: '',
    // 卡支付密码弹框
    passwordFlag: false,
    // 点击支付的按钮,card:卡支付;wechat:微信支付
    frombtn: '',
    // otc,区分购物车与立即购买now:正常立即购买
    otc: '',
    // isotc,区分拼团砍价的普通立即购买还是活动立即购买
    isotc: '',
    // orderType,订单类型
    orderType: 0,
    // groupno,活动号
    groupno: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      orderDetail: app.globalData.orderDetail,
      paymode3Flag: app.globalData.paymodeFlag.paymode3Flag,
      paymode4Flag: app.globalData.paymodeFlag.paymode4Flag,
      paymode5Flag: app.globalData.paymodeFlag.paymode5Flag,
      paymode7Flag: app.globalData.paymodeFlag.paymode7Flag,
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode,
      otc: options.otc,
      isotc: options.isotc,
      orderType: options.orderType,
      goodscode: options.goodscode,
      amount: options.amount,
      groupno: options.groupno,
    })
    // 判断购物车结算还是单一商品立即购买
    if (self.data.goodscode) {
      // 获取商品详情
      self.getGoodsDetail()
    } else {
      // 获取购物车列表
      self.getCartList()
    }
    // 获取配送时间列表
    self.getSendTime()
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
      address: app.globalData.address,
    })
    if (self.data.orderDetail) {
      // 获取电子券信息
      self.getTick()
      // 获取收货地址
      self.getAddress()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    self.setData({
      tick: '',
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
    app.globalData.tick = ''
    self.setData({
      tick: '',
    })
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

  // 获取商品详情
  getGoodsDetail() {
    let self = this
    let data = {
      Gdscode: self.data.goodscode,
      Utype: self.data.Utype,
      Deptcode: self.data.deptcode
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.info.getProductDetails(data).then(result => {
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          goodsDetail: res.data,
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取购物车列表
  getCartList() {
    let self = this
    let data = {}
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.bill.listMyCar(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data && res.data.carList) {
          self.setData({
            cartList: res.data.carList,
          })
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取收货地址
  getAddress() {
    let self = this
    let addressId = app.globalData.addressId
    if (addressId) {
      let data = {
        addressid: addressId,
      }
      API.system.listAddressInfo(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          let address = res.data
          app.globalData.address = address
          // 获取运费
          self.getFreight()
        } else {
          toast(res.message)
        }
      }).catch(error => {
        toast(error.error)
      })
    } else { // 无配送地址清空运费重新计算
      self.setData({
        freight: ''
      })
      // 设置订单支付金额
      self.setPayMoney()
    }
  },

  // 获取运费
  getFreight() {
    let self = this
    let data = {
      otc: self.data.otc,
      goodscode: self.data.goodscode,
      amount: self.data.amount,
      sendId: app.globalData.addressId,
      Paymode: 0,
      Actmoney: self.data.orderDetail.actmoney,
      distanceflag: 1,
    }
    API.bill.getFreight(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let address = app.globalData.address
        self.setData({
          address: address,
          freight: res.data,
        })
      } else {
        // 请求运费失败清除地址信息
        self.setData({
          address: '',
        })
        app.globalData.addressId = ''
        app.globalData.address = ''
        self.setData({
          freight: ''
        })
        toast(res.message)
      }
      // 设置订单支付金额
      self.setPayMoney()
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取配送时间树
  getSendTime() {
    let self = this
    let data = {}
    API.bill.getSendTime(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          sendTimeList: res.data
        })
        // 设置配送时间列表
        self.setDeliverytimeList()
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置配送时间列表
  setDeliverytimeList() {
    let self = this
    let sendTimeList = self.data.sendTimeList
    let deliverytimeList = []
    let timeList = []
    sendTimeList.forEach((item, index) => {
      if (index === self.data.deliverytimeIndex[0]) {
        timeList = item.time
      }
    })
    deliverytimeList[0] = sendTimeList
    deliverytimeList[1] = timeList
    self.setData({
      deliverytimeList: deliverytimeList,
    })
  },

  // 配送时间picker变更
  bindMultiPickerColumnChange(e) {
    let self = this
    let { column, value } = e.detail
    let deliverytimeIndex = self.data.deliverytimeIndex
    let arr = []
    if (column === 0) {
      arr = [value, 0]
    } else {
      arr = [deliverytimeIndex[0], value]
    }
    self.setData({
      deliverytimeIndex: arr
    })
    // 设置配送时间列表
    self.setDeliverytimeList()
  },

  // 配送时间变更
  deliverytimeChange(e) {
    let self = this
    let { value } = e.detail
    let deliverytimeList = self.data.deliverytimeList
    self.setData({
      deliverydate: deliverytimeList[0][value[0]].sendtime,
      deliverytime: deliverytimeList[1][value[1]].sendtime,
    })
  },

  // 获取可用积分
  getScore() {
    let self = this
    let data = {
      payMoney: parseFloat(self.data.payMoney),
      Totalmoney: self.data.orderDetail.needpaymoney + self.data.freight.freight,
    }
    self.setData({
      scoreFlag: false,
      useScoreMoney: 0,
    })
    API.bill.payMoneyjf(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          score: res.data,
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取电子券信息
  getTick() {
    let self = this
    let tick = app.globalData.tick
    if (tick) {
      self.setData({
        tick: tick,
      })
      // 设置订单支付金额
      self.setPayMoney()
    }
  },

  // 设置电子券可用标识
  getEditorOrder() {
    let self = this
    let data = {
      payMoney: parseFloat(self.data.payMoney),
      Totalmoney: parseFloat(self.data.orderDetail.needpaymoney),
    }
    API.bill.payMoneytick(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          isUseTickflag: res.data.length
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 去电子券列表
  toTickList() {
    let self = this
    if (!self.data.address) {
      toast('请先选择收货地址')
      return false
    }
    wx.navigateTo({
      url: '/autoModule/pages/tickList/tickList?from=editorOrder&payMoney=' + self.data.payMoney + '&Totalmoney=' + self.data.orderDetail.needpaymoney,
    })
  },

  // 设置订单备注
  setRemark(e) {
    let self = this
    self.setData({
      remark: e.detail.value,
    })
  },

  // 去地址列表
  toAddressList() {
    let self = this
    wx.navigateTo({
      url: '/userInfo/pages/addressList/addressList?from=' + 'editorOrder' + '&gdscode=' + self.data.goodscode,
    })
  },

  // 设置积分使用开关
  setScoreFlag(e) {
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
  setPayMoney() {
    let self = this
    // 商品总金额
    let totalMoney = self.data.orderDetail.needpaymoney
    // 积分抵扣金额
    let useScoreMoney = self.data.useScoreMoney
    // 运费
    let freight = self.data.freight.freight || 0
    // 电子券
    let tickMoney = self.data.tick.paymoney || ''
    self.setData({
      payMoney: (totalMoney - useScoreMoney - (tickMoney || 0) + freight).toFixed(2)
    })
    // 仅首次进入时用查询有无可用电子券
    if (self.data.getUseTickflag) {
      // 设置电子券可用标识
      self.getEditorOrder()
      // 请求后关闭，不允许再次请求
      self.setData({
        getUseTickflag: false
      })
    }
    // 使用积分时不重新请求可用积分
    if (!self.data.scoreFlag) {
      // 获取可用积分
      self.getScore()
    }
  },

  // 验证支付信息完整以及是否调用密码弹框
  payVerify(e) {
    let self = this
    let address = app.globalData.address || ''
    let orderDetail = self.data.orderDetail
    let from = e.currentTarget.dataset.from
    self.setData({
      frombtn: from,
    })
    // 获取支付按钮
    let cardBtn = self.selectComponent('#cardBtn')
    let wechatBtn = self.selectComponent('#wechatBtn')
    // 验证收货地址
    if (!address) {
      toast('请选择收货地址')
      return false
    }
    if (from === 'card') {
      // 设置支付信息
      cardBtn.isSetPasswordShow()
    } else if (from === 'wechat') {
      // 设置支付信息
      wechatBtn.isSetPasswordShow()
    }
  },

  // 设置密码弹框开关
  setPasswordFlag() {
    let self = this
    self.setData({
      passwordFlag: !self.data.passwordFlag,
      remarkFlag: !self.data.remarkFlag
    })
  },

  // 获取子组件支付密码
  getPassword(e) {
    let self = this
    let from = self.data.frombtn
    // 获取支付按钮
    let cardBtn = self.selectComponent('#cardBtn')
    let wechatBtn = self.selectComponent('#wechatBtn')
    // 设置密码弹框开关
    self.setPasswordFlag()
    self.setData({
      password: e.detail,
    })
    if (from === 'card') {
      // 设置支付信息
      cardBtn.setPaylist()
    } else if (from === 'wechat') {
      // 设置支付信息
      wechatBtn.setPaylist()
    }
  },

})
