// component/useTickBtn/useTickBtn.js
require('../../app.js')
const app = getApp()
const toast = require('../../utils/toast.js')
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // tick
    tick: {
      type: Object,
      value: null,
    },
    // 订单商品金额
    Totalmoney: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 支付方式
    paymode: '003',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 使用电子券
    useTick (e) {
      let self = this
      let tick = self.data.tick
      tick.paymode = 4
      let data = {
        limitcode: tick.limitcode,
        limittype: tick.limittype,
        tickid: tick.ticketid,
        paymode: self.data.paymode,
        paymoney: tick.usemoney,
        specialflag: tick.specialflag,
        minsalemoney: tick.minsalemoney,
        tickettype: tick.tickettype,
        tickgdscode: tick.tickgdscode,
        noPayMoney: self.data.Totalmoney,
      }
      API.mem.payTicketCheck(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (tick.tickettype === 2) {
            tick.paymoney = res.data.DicountMoney
          } else {
            tick.paymoney = tick.usemoney
          }
          app.globalData.tick = tick
          wx.navigateBack()
        } else {
          toast.toast(res.message)
        }
      }).catch(error => {
        toast.toast(error.error)
      })
    },
  }
})
