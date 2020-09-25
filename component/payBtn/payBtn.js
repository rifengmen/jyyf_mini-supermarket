// component/payBtn/payBtn.js
require('../../app.js')
const request = require('../../utils/request.js')
const toast = require('../../utils/toast.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 谁调用
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
    // 优惠券金额
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
      type:String,
      value: '',
    },
    // 订单编号
    tradeno: {
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 支付
    pay () {
      let self = this
      let globalData = getApp().globalData
      let paymode = ''
      if (self.data.from === 'card') {
        paymode = 3
      } else if (self.data.from === 'wechat') {
        paymode = 7
      }
      let tick = self.data.tick
      let score = self.data.score
      let orderDetail = self.data.orderDetail
      // 组合支付方式列表
      let paylist = [
        {paymode: paymode, paymoney: self.data.payMoney},
      ]
      // 优惠券
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
        let paydesc = {score: score.useScore, paymoney: score.Money, memcode: globalData.memcode, paymode: 5}
        paylist.push(paydesc)
      }
      let data = {
        Sendid: globalData.addressId || 0,
        Usernote: self.data.remark,
        Memcode: globalData.memcode,
        paylist: paylist,
        channel: "WX_MINI",
        freight: self.data.freight,
        receiver: globalData.address.username,
        receiverphone: globalData.address.phone,
        Cpassword: self.data.password,
        Tradeno: orderDetail.tradeno
      }
      request.http('mem/member.do?method=ordercommit', data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (paymode === 3) {
            wx.redirectTo({
              url: '/pages/payEnd/payEnd?text=支付成功&type=1',
            })
          } else if (paymode === 7) {
            // 微信支付
            let payStr = res.data.beecloud.payStr
            self.setData({
              payStr: payStr,
            })
            self.wechatPayment()
          }
        } else {
          toast.toast(res.message)
          wx.redirectTo({
            url: '/pages/payEnd/payEnd?text=支付失败&type=0',
          })
        }
        toast.toast(res.message)
      }).catch(error => {
        toast.toast(error.error)
      })
    },

    // 微信支付
    wechatPayment () {
      let self = this
      let payStr = self.data.payStr
      wx.requestPayment(
        {
          appId: payStr.appID,
          timeStamp: payStr.timeStamp,
          nonceStr: payStr.nonceStr,
          package: payStr.package,
          signType: payStr.signType,
          paySign: payStr.paySign,
          success:function(res){
            wx.redirectTo({
              url: '/pages/payEnd/payEnd?text=支付成功&type=1',
            })
          },
          fail:function(res){
            wx.redirectTo({
            url: '/pages/payEnd/payEnd?text=支付失败&type=0',
          })
          },
          complete:function(res){}
        })
    },
  }
})
