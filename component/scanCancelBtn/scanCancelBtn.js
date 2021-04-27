// component/scanCancelBtn/scanCancelBtn.js
require('../../app.js')
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 流水号
    flowno: {
      type: String,
      value: ''
    },
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
    // 取消
    isCancel () {
      let self = this
      wx.showModal({
        title: '提示',
        content: '确认取消订单吗？',
        success: res => {
          // 确认
          if (res.confirm) {
            // 取消
            self.cancel()
          }
        }
      })
    },

    // 取消订单
    cancel () {
      let self = this
      let data = {
        flowno: self.data.flowno,
      }
      API.invest.cancelSaleOrder(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          toast('取消成功!')
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
