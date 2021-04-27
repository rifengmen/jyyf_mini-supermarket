// scan/pages/editorOrder/editorOrder.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 店铺信息
    deptcode: '',
    deptname: '',
    // 流水号
    flowno: '',
    // 订单详情
    scanOrderDetail: '',
    // 订单商品列表
    goodsList: [],
    // 订单金额
    totalMoney: 0,
    // 支付金额
    payMoney: 0,
    // 支付方式列表
    paymodeList: [],
    // 支付信息
    paylist: [],
    // 支付方式
    paymode: 7,
    // 储值卡支付方式开关
    paymode3Flag: false,
    // 优惠券支付方式开关
    paymode4Flag: false,
    // 积分支付方式开关
    paymode5Flag: false,
    // 微信支付方式开关
    paymode7Flag: false,
    // 积分
    score: '',
    // 积分抵扣金额
    useScoreMoney: 0,
    // 积分使用开关
    scoreFlag: false,
    // 电子券
    scanTick: '',
    // 电子券可用标识请求开关
    getUseTickflag: true,
    // 电子券可用标识
    isUseTickflag: true,
    // 支付方式,true:微信，false：储值卡
    payFlag: true,
    // 支付密码
    password: '',
    // 密码弹框开关
    passwordFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      deptcode: options.deptcode,
      deptname: options.deptname,
      flowno: options.flowno,
    })
    // 获取订单详情
    self.getScanOrderDetail()
    // 获取支付方式列表
    self.getMicroFlowPayMoney()
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
    if (self.data.scanOrderDetail) {
      // 获取电子券信息
      self.getScanTick()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    self.setData({
      scanTick: '',
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
    app.globalData.scanTick = ''
    self.setData({
      scanTick: '',
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

  // 获取订单详情
  getScanOrderDetail () {
    let self = this
    let data = {
      ordernum: self.data.flowno,
      bmcode: self.data.deptcode
    }
    API.invest.listMicroFlowDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let order = res.data
        self.setData({
          scanOrderDetail: order,
          goodsList: order.OrderDetail,
          totalMoney: order.shouldmoney.toFixed(2),
          payMoney: (order.shouldmoney - order.paymoney).toFixed(2),
        })
        // 获取电子券信息
        self.getScanTick()
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取支付方式列表
  getMicroFlowPayMoney () {
    let self = this
    let data = {
      shopCode: self.data.deptcode,
      flowno: self.data.flowno,
    }
    API.invest.getMicroFlowPayMoney(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let paymodelist = res.data
        let paymode3Flag = paymodelist.filter(item => item.paymodeid === 3).length ? true : false
        let paymode4Flag = paymodelist.filter(item => item.paymodeid === 4).length ? true : false
        let paymode5Flag = paymodelist.filter(item => item.paymodeid === 5).length ? true : false
        let paymode7Flag = paymodelist.filter(item => item.paymodeid === 7).length ? true : false
        // 保存信息
        self.setData({
          paymode3Flag: paymode3Flag,
          paymode4Flag: paymode4Flag,
          paymode5Flag: paymode5Flag,
          paymode7Flag: paymode7Flag,
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取可用积分
  getScore () {
    let self = this
    let data = {
      payMoney: Number(self.data.payMoney),
      TotalMoney: Number(self.data.totalMoney),
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
  getScanTick () {
    let self = this
    let scanTick = app.globalData.scanTick
    self.setData({
      scanTick: scanTick,
      scoreFlag: false,
      useScoreMoney: 0,
    })
    // 设置订单支付金额
    self.setPaymoney()
  },

  // 设置电子券可用标识
  getEditorOrder () {
    let self = this
    let data = {
      payMoney: Number(self.data.payMoney),
      Totalmoney: Number(self.data.totalMoney),
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
  toTickList () {
    let self = this
    wx.navigateTo({
      url: '/autoModule/pages/tickList/tickList?from=scanEditorOrder&tradeno=' + self.data.flowno + '&payMoney=' + self.data.payMoney + '&Totalmoney=' + self.data.totalMoney,
    })
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
    self.setPaymoney()
  },

  // 设置订单支付金额
  setPaymoney () {
    let self = this
    // 商品总金额
    let totalMoney = self.data.totalMoney
    // 积分抵扣金额
    let useScoreMoney = self.data.useScoreMoney
    // 电子券
    let tickMoney = self.data.scanTick.paymoney || ''
    // 已支付金额
    let paymoney = self.data.scanOrderDetail.paymoney || ''
    self.setData({
      payMoney: (totalMoney - useScoreMoney - (tickMoney || 0) - paymoney).toFixed(2)
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

  // 设置支付信息
  setPaylist () {
    let self = this
    let paymode = self.data.paymode
    let scanTick = self.data.scanTick
    let score = self.data.score
    let payMoney = self.data.payMoney
    // 组合支付方式列表
    let paylist = [
      {paymode: paymode, paymoney: payMoney},
    ]
    // 电子券
    if (scanTick) {
      let paydesc = {
        paymode: scanTick.paymode,
        paymoney: Number(scanTick.paymoney),
        ticketid: scanTick.tickid,
        limittype: scanTick.limittype,
        limitcode: scanTick.limitcode,
        specialflag: scanTick.specialflag,
        minsalemoney: scanTick.minsalemoney,
        tickettype: scanTick.tickettype,
        tickgdscode: scanTick.tickgdscode,
      }
      paylist.push(paydesc)
    }
    // 积分抵扣
    if (self.data.scoreFlag) {
      let paydesc = {score: score.useScore, paymoney: score.Money, memcode: app.globalData.memcode, paymode: 5}
      paylist.push(paydesc)
    }
    self.setData({
      paylist: paylist
    })
    let passwordShow = paylist.filter(item => item.paymode !== 7)
    // 验证是否调用密码弹框
    if (passwordShow.length && !self.data.password) {
      // 设置密码弹框开关
      self.setPasswordFlag()
      return false
    }
    // 立即支付
    self.pay()
  },

  // 切换支付方式
  radioChange (e) {
    let self = this
    let paymode = parseFloat(e.detail.value)
    let payFlag = true
    if (paymode === 3) {
      payFlag = false
    } else if (paymode === 7) {
      payFlag = true
    }
    self.setData({
      payFlag: payFlag,
      paymode: paymode
    })
  },

  // 立即支付
  pay () {
    let self = this
    let paymode = self.data.paymode
    let data = {
      flowno: self.data.flowno,
      payPassword: self.data.password,
      channel: 'WX_MINI',
      payList: self.data.paylist,
      shopCode: self.data.deptcode
    }
    API.invest.microFlowToPay(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 微信支付
        if (res.data) {
          let payStr = res.data.beecloud.miniPayStr
          self.setData({
            payStr: payStr,
          })
          self.wechatPayment()
        } else {
          wx.redirectTo({
            url: '/shopping/pages/payEnd/payEnd?text=支付成功&type=1',
          })
        }
      } else {
        wx.redirectTo({
          url: '/shopping/pages/payEnd/payEnd?text=支付失败&type=0',
        })
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 微信支付
  wechatPayment () {
    let self = this
    let payStr = self.data.payStr
    wx.requestPayment({
      appId: payStr.appID,
      timeStamp: payStr.timeStamp,
      nonceStr: payStr.nonceStr,
      package: payStr.package,
      signType: payStr.signType,
      paySign: payStr.paySign,
      success:function(res){
        wx.redirectTo({
          url: '/shopping/pages/payEnd/payEnd?text=支付成功&type=1',
        })
      },
      fail:function(res){
        wx.redirectTo({
          url: '/shopping/pages/payEnd/payEnd?text=支付失败&type=0',
        })
      },
      complete:function(res){}
    })
  },

  // 设置密码弹框开关
  setPasswordFlag () {
    let self = this
    self.setData({
      passwordFlag: !self.data.passwordFlag
    })
  },

  // 获取子组件支付密码
  getPassword (e) {
    let self = this
    self.setData({
      password: e.detail,
      passwordFlag: false,
    })
    // 立即支付
    self.pay()
  },
})
