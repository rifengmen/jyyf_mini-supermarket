// component/payBtn/payBtn.js
require('../../app.js')
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 从哪里来/组件使用的地方
    from: {
      type: String,
      value: '',
    },
    // 待支付金额
    payMoney: {
      type: Number,
      value: 0,
    },
    // 积分抵扣开关
    scoreFlag: {
      type: Boolean,
      value: false,
    },
    // 积分信息
    score: {
      type: Object,
      value: null,
    },
    // 电子券金额
    tick: {
      type: Object,
      value: null,
    },
    // 运费+配送服务费
    freight: {
      type: Number,
      value: 0,
    },
    // 订单详情
    orderDetail: {
      type: Object,
      value: null,
    },
    // 订单备注
    remark: {
      type: String,
      value: '',
    },
    // 卡支付密码
    password: {
      type: String,
      value: '',
    },
    // otc,区分购物车与立即购买
    otc: {
      type: String,
      value: '',
    },
    // isotc,区分拼团砍价的普通立即购买还是活动立即购买
    isotc: {
      type: String,
      value: '',
    },
    // orderType,订单类型
    orderType: {
      type: Number,
      value: 2,
    },
    // goodscode，立即购买商品code
    goodscode: {
      type: String,
      value: '',
    },
    // amount,立即购买商品数量
    amount: {
      type: Number,
      value: 1,
    },
    // groupno,活动号
    groupno: {
      type: String,
      value: '',
    },
    // 订单编号
    tradeno: {
      type: String,
      value: '',
    },
    // 商品详情
    goodsDetail: {
      type: Object,
      value: null,
    },
    // 配送日期
    deliverydate: {
      type: String,
      value: '',
    },
    // 配送时间
    deliverytime: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 微信支付参数
    payStr: '',
    // 储值卡名称
    cardname: app.globalData.cardname,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 是否显示密码弹框
    isSetPasswordShow() {
      let self = this
      if (self.data.from === 'card' || self.data.scoreFlag || self.data.tick) {
        // 设置密码弹框开关
        self.triggerEvent('setPasswordFlag')
        return false
      }
      // 设置支付信息
      self.setPaylist()
    },

    // 设置支付信息
    setPaylist() {
      wx.showLoading({
        title: '请求等待中...',
        mask: true,
      });
      let self = this
      let globalData = app.globalData
      let paymode = ''
      if (self.data.from === 'card') {
        paymode = 3
      } else if (self.data.from === 'wechat') {
        paymode = 7
      }
      self.setData({
        paymode: paymode
      })
      let tick = self.data.tick
      let score = self.data.score
      // 组合支付方式列表
      let paylist = [
        { paymode: paymode, paymoney: self.data.payMoney },
      ]
      // 电子券
      if (tick) {
        let paydesc = {
          paymode: tick.paymode,
          paymoney: Number(tick.paymoney),
          ticketid: tick.tickid,
          limittype: tick.limittype,
          limitcode: tick.limitcode,
          specialflag: tick.specialflag,
          minsalemoney: tick.minsalemoney,
          tickettype: tick.tickettype,
          tickgdscode: tick.tickgdscode,
        }
        paylist.push(paydesc)
      }
      // 积分抵扣
      if (self.data.scoreFlag) {
        let paydesc = { score: score.useScore, paymoney: score.Money, memcode: globalData.memcode, paymode: 5 }
        paylist.push(paydesc)
      }
      self.setData({
        paylist: paylist
      })
      // 立即支付
      self.pay()
    },

    // 立即支付
    pay() {
      let self = this
      let globalData = app.globalData
      let data = {
        Sendid: globalData.addressId || 0,
        Usernote: self.data.remark,
        Memcode: globalData.memcode,
        deliverydate: self.data.deliverydate,
        deliverytime: self.data.deliverytime,
        paylist: self.data.paylist,
        channel: "WX_MINI",
        otc: self.data.otc,
        isotc: self.data.isotc,
        orderType: self.data.orderType,
        goodscode: self.data.goodscode,
        amount: self.data.amount,
        groupno: self.data.groupno,
        freight: self.data.freight,
        receiver: globalData.address.username,
        receiverphone: globalData.address.phone,
        Cpassword: self.data.password,
        Tradeno: self.data.orderDetail.tradeno
      }
      API.mem.ordercommit(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (res.data.beecloud.miniPayStr) {
            // 微信支付
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
        wx.hideLoading();
        toast(res.message)
        // 清除结算信息
        self.clearOrderDetail()
      }).catch(error => {
        wx.hideLoading();
        toast(error.error)
      })
    },

    // 秒杀立即支付
    panicPay() {
      let self = this
      let goodsDetail = self.data.goodsDetail
      let data = {
        goodscode: goodsDetail.gdscode,
        amount: goodsDetail.amount,
      }
      wx.showLoading({
        title: '请求等待中...',
        mask: true,
      });
      API.mem.payOrderComit(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          // 微信支付
          let payStr = res.data.beecloud.miniPayStr
          self.setData({
            payStr: payStr,
          })
          self.wechatPayment()
        } else {
          toast(res.message)
        }
        wx.hideLoading();
      }).catch(error => {
        wx.hideLoading();
        toast(error.error)
      })
    },

    // 微信支付
    wechatPayment() {
      let self = this
      let payStr = self.data.payStr
      wx.requestPayment({
        appId: payStr.appID,
        timeStamp: payStr.timeStamp,
        nonceStr: payStr.nonceStr,
        package: payStr.package,
        signType: payStr.signType,
        paySign: payStr.paySign,
        success: function (res) {
          wx.redirectTo({
            url: '/shopping/pages/payEnd/payEnd?text=支付成功&type=1',
          })
        },
        fail: function (res) {
          wx.redirectTo({
            url: '/shopping/pages/payEnd/payEnd?text=支付失败&type=0',
          })
        },
        complete: function (res) { }
      })
    },

    // 清除结算信息
    clearOrderDetail() {
      let self = this
      app.globalData.address = ''
      app.globalData.addressId = ''
      app.globalData.tick = ''
      app.globalData.orderDetail = ''
      app.globalData.paymodeFlag = ''
    },
  }
})
