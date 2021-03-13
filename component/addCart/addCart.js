// component/addCart/addCart.js
require('../../app.js')
const app = getApp()
const toast = require('../../utils/toast.js')
import API from '../../api/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 从哪里来/组件使用的地方
    from: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 用户id
    userid: app.globalData.userid,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 加入购物车
    addCart (goods) {
      let self = this
      let data = {
        Userid: self.data.userid,
        Gdscode: goods.Gdscode,
        Count: goods.amount,
        Buyprice: goods.Highpprice,
        Actuslmoney: goods.Highpprice,
      }
      // 验证是否授权
      if (!app.authorFlag()) {
        wx.navigateTo({
          url: '/pages/author/author',
        })
        return false
      }
      // // 验证是否绑定手机号码
      // if (!app.memcodeflag()) {
      //   wx.switchTab({
      //     url: '/pages/userInfo/userInfo',
      //   })
      //   toast.toast('请注册绑定手机号码')
      //   return false
      // }
      API.bill.inputIntoCar(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          toast.toast('添加成功')
          // 更新购物车数量
          self.triggerEvent('getCartCount')
        } else {
          toast.toast(res.message)
        }
      }).catch(error => {
        toast.toast(error.error)
      })
    },
  }
})
