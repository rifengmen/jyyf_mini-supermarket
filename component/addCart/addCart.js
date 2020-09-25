// component/addCart/addCart.js
require('../../app.js')
const request = require('../../utils/request.js')
const toast = require('../../utils/toast.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    from: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 用户id
    userid: getApp().globalData.userid,
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
      let app = getApp()
      let data = {
        Userid: app.globalData.userid,
        Gdscode: goods.Gdscode,
        Count: goods.count || self.data.count,
        Buyprice: goods.Highpprice,
        barflag: self.data.barflag,
        Actuslmoney: goods.Highpprice,
      }
      // 验证是否授权
      if (!app.authorFlag()) {
        wx.navigateTo({
          url: '/pages/author/author',
        })
        return false
      }
      // 验证是否绑定手机号码
      if (!app.memcodeflag()) {
        wx.navigateTo({
          url: '/pages/register/register',
        })
        return false
      }
      request.http('bill/shoppingcar.do?method=inputIntoCar', data).then(result => {
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

    // 更新购物车数量
    // getCartCount () {
    //   let self = this
    //   let data = {}
    //   request.http('bill/shoppingcar.do?method=getCarProductCount', data).then  (result => {
    //     let res = result.data
    //     if (res.flag === 1) {
    //       self.triggerEvent('getCartCount')
    //       // if (res.data.data) {
    //       //   wx.setTabBarBadge({
    //       //     index: 2,
    //       //     text: (res.data.data).toString()
    //       //   })
    //       // } else {
    //       //   wx.removeTabBarBadge({
    //       //     index: 2
    //       //   })
    //       // }
    //     } else {
    //       toast.toast(res.message)
    //     }
    //   }).catch(error => {
    //     toast.toast(error.error)
    //   })
    // },
  }
})
