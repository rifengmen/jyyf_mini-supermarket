// component/useTickBtn/useTickBtn.js
require('../../app.js')
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 调用的地方
    from: {
      type: String,
      value: 'editorOrder',
    },
    // tradeno，订单编号
    tradeno: {
      type: String,
      value: '',
    },
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
      let from = self.data.from
      let tick = self.data.tick
      tick.paymode = 4
      let data = {
        fromwhere: from,
        tradeno: self.data.tradeno,
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
          if (from === 'editorOrder') {
            app.globalData.tick = tick
          } else if (from === 'scanEditorOrder') {
            app.globalData.scanTick = tick
          }
          wx.navigateBack()
        } else {
          toast(res.message)
        }
      }).catch(error => {
        toast(error.error)
      })
    },
  }
})
