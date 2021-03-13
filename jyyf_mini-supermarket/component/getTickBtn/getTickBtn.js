// component/getTickBtn/getTickBtn.js
require('../../app.js')
const app = getApp()
const toast = require('../../utils/toast.js')
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // tickid
    tickid: {
      type: String,
      value: '',
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
    // 领取电子券
    getTick () {
      let self = this
      let tickid = self.data.tickid
      let data = {
        tickid: tickid,
      }
      API.mem.panicCoupon(data).then(result => {
        let res = result.data
        toast.toast(res.message)
      }).catch(error => {
        toast.toast(error.error)
      })
    },
  }
})
