// component/scanCancelBtn/scanCancelBtn.js
require('../../app.js')
const request = require('../../utils/request.js')
const toast = require('../../utils/toast.js')

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
    // 门店编号
    deptcode: {
      type: String,
      value: ''
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
    // 取消
    isCancel () {
      let self = this
      wx.showModal({
        title: '提示',
        content: '确认取消订单吗？',
        success: res=>{
          if (res.confirm) {
            // 取消
            self.cancel()
          }
        }
      })
    },

    // 取消
    cancel () {
      let self = this
      let data = {
        flowno: self.data.flowno,
        deptcode: self.data.deptcode
      }
      request.http('invest/microFlow.do?method=cancelSaleOrder', data, 'POST').then(result => {
        let res = result.data
        if (res.flag === 1) {
          toast.toast('取消成功!')
          if (self.route === '/scan/pages/orderList/orderList') {
            // 页面重载
            self.onLoad()
            return false
          }
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
