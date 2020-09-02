// pages/component/addcart.js
require('../../app.js')
const request = require('../../utils/request.js')
const toast = require('../../utils/toast.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 商品code
    gdscode: {
      type: String,
      value: ''
    },
    // 商品价格
    buyprice: {
      type: String,
      value: ''
    },
    // 商品数量
    count: {
      type: String,
      value: '1'
    },
    // 扫码购标识，扫码购为1，否则为0
    barflag: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 用户id
    userid: getApp().globalData.userid,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 加入购物车
    addCart () {
      let self = this
      let app = getApp()
      let data = {
        Userid: app.globalData.userid,
        Gdscode: self.data.gdscode,
        Count: self.data.count,
        Buyprice: self.data.buyprice,
        barflag: self.data.barflag,
        Actuslmoney: self.data.buyprice,
      }
      console.log(app, '11')
      let authorFlag = app.authorFlag()
      if (!authorFlag) {
        console.log('22')
        wx.navigateTo({
          url: '/pages/author/author',
        })
      }
      request.http('bill/shoppingcar.do?method=inputIntoCar', data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          toast.toast('添加成功')
        } else {
          toast.toast(res.message)
        }
      }).catch(error => {
        toast.toast(error.error)
      })
    },
  }
})
