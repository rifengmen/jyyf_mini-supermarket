// component/addCart/addCart.js
require('../../app.js')
const app = getApp()
const request = require('../../utils/request.js')
const toast = require('../../utils/toast.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 调用的地方
    from: {
      type: String,
      value: ''
    },
    // 抢购单号
    panicBuy: {
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
    // 商品数量
    count: 1,
    // 商品code
    gdscode: '',
    // 商品价格
    buyprice: '',
    // 扫码购标识，扫码购为1，否则为0
    barflag: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 加入购物车
    addCart (goods) {
      let self = this
      let data = {
        Userid: app.globalData.userid,
        Gdscode: goods.Gdscode,
        Count: goods.count || self.data.count,
        Buyprice: goods.Highpprice,
        barflag: self.data.barflag,
        Actuslmoney: goods.Highpprice,
        panicbuycode: goods.panicbuycode,
      }
      let url = ''
      // 验证是否授权
      if (!app.authorFlag()) {
        wx.navigateTo({
          url: '/pages/author/author',
        })
        return false
      }
      // 验证是否绑定手机号码
      if (!app.memcodeflag()) {
        toast.toast('请注册绑定手机号码')
        wx.switchTab({
          url: '/pages/userInfo/userInfo',
        })
        return false
      }
      if (self.data.panicBuy) {
        url = 'info/panicGdscode.do?method=inputIntoCarForPanic'
      } else {
        url = 'bill/shoppingcar.do?method=inputIntoCar'
      }
      request.http(url, data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (self.data.panicBuy) {
            toast.toast(res.message)
          } else {
            toast.toast('添加成功')
          }
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
