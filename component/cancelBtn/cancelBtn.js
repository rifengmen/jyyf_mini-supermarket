// component/cancelBtn/cancelBtn.js
require('../../app.js')
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tradeno: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消订单
    cancel () {
      let self = this
      wx.showModal({
        title: '提示',
        content: '您确定要取消此订单吗？',
        success: res => {
          // 确认
          if (res.confirm) {
            // 确认按钮
            self.confirm()
          }
        }
      })
    },

    // 取消订单
    confirm () {
      let self = this
      let tradeno = self.data.tradeno
      let data = {
        tradeno: tradeno
      }
      API.bill.CancelSaleOrder(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          self.triggerEvent('setOrderList', tradeno)
        }
        if (res.message) {
          toast(res.message)
        }
      }).catch(error => {
        toast(error.error)
      })
    },
  }
})
