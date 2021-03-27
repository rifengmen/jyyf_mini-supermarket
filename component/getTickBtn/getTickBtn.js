// component/getTickBtn/getTickBtn.js
require('../../app.js')
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // tick
    tick: {
      type: Object,
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
    // 判断是否积分兑换
    isScore () {
      let self = this
      let tick = self.data.tick
      // 判断积分兑换券
      if (tick.gettype === 2) {
        wx.showModal({
          title: '提示',
          content: '确认使用' + tick.score + '积分兑换吗？',
          success: res => {
            // 确认
            if (res.confirm) {
              // 领取优惠券
              self.getTick()
            }
          },

        })
      } else {
        // 领取优惠券
        self.getTick()
      }
    },

    // 领取电子券
    getTick () {
      let self = this
      let tick = self.data.tick
      let data = {
        tickid: tick.tickid,
      }
      if (!tick.residuecount) {
        toast('此券已领完!')
        return false
      }
      API.mem.panicCoupon(data).then(result => {
        let res = result.data
        toast(res.message)
      }).catch(error => {
        toast(error.error)
      })
    },
  }
})
