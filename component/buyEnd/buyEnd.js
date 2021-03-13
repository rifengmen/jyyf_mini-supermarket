// component/buyEnd/buyEnd.js
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
      value: '',
    },
    // cartCount(购物车用)
    cartCount: {
      type: Number,
      value: 0,
    },
    // 订单号(再支付用)
    tradeno: {
      type: String,
      value: '',
    },
    // orderType
    orderType: {
      type: Number,
      value: 2,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 商品详情
    goodsDetail: '',
    // otc,区分购物车与立即购买now:正常立即购买
    otc: '',
    // isotc,区分拼团砍价的普通立即购买还是活动立即购买
    isotc: '',
    // // orderType,订单类型
    // orderType: 0,
    // 商品code(立即购买)
    goodscode: '',
    // 商品数量(立即购买)
    amount: '',
    // 运费计算方式，1:按照距离计算运费
    distanceflag: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去结算
    toBuyEnd (goods) {
      let self = this
      let data = ''
      // 设置商品详情
      self.setData({
        goodsDetail: goods
      })
      // 判断秒杀商品,走单独结算接口
      if (goods.promotemode === 101) {
        let paybtn = self.selectComponent('#paybtn')
        // 调用子组件直接结算
        paybtn.panicPay()
        return false
      }
      // 判断购物车结算/商品立即购买/再支付
      if (self.data.from === 'order') { // 再支付
        data = {
          Tradeno: self.data.tradeno,
        }
      } else if (self.data.from === 'goodsDetail') { // 立即购买
        data = {
          otc: goods.otc,
          isotc: goods.isotc,
          orderType: goods.orderType,
          goodscode: goods.Gdscode,
          groupno: goods.groupno,
          amount: goods.amount,
          distanceflag: self.data.distanceflag,// 按照距离计算运费
        }
      } else { // 购物车结算
        data = {
          distanceflag: self.data.distanceflag,// 按照距离计算运费
        }
      }
      // 结算buyend
      self.buyend(data, goods)
    },

    // 结算buyend
    buyend (data, goods) {
      let self = this
      // 验证是否授权
      if (!app.authorFlag()) {
        wx.navigateTo({
          url: '/pages/author/author',
        })
        return false
      }
      API.bill.buyend(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          let orderDetail = res.data
          orderDetail.tradeno = self.data.tradeno
          let paymodelist = orderDetail.Paymodelist
          let paymode3Flag = paymodelist.filter(item => item.paymodeid === 3).length ? true : false
          let paymode4Flag = paymodelist.filter(item => item.paymodeid === 4).length ? true : false
          let paymode5Flag = paymodelist.filter(item => item.paymodeid === 5).length ? true : false
          let paymode7Flag = paymodelist.filter(item => item.paymodeid === 7).length ? true : false
          // 保存信息
          app.globalData.orderDetail = orderDetail
          app.globalData.paymodeFlag = {
            paymode3Flag: paymode3Flag,
            paymode4Flag: paymode4Flag,
            paymode5Flag: paymode5Flag,
            paymode7Flag: paymode7Flag,
          }
          // 判断是否有默认收货地址或者只能自提，-1：只能自提；0：未设置默认收货地址，>0:默认收货地址id
          if (orderDetail.sendId > 0) {
            app.globalData.addressId = orderDetail.sendId
          }
          // 判断再支付还是编辑订单
          if (self.data.from === 'order') { // 再支付
            wx.navigateTo({
              url: '/userInfo/pages/againPay/againPay'
            })
          } else { // 编辑订单
            wx.navigateTo({
              url: '/shopping/pages/editorOrder/editorOrder?otc=' + goods.otc + '&isotc=' + goods.isotc + '&orderType=' + goods.orderType + '&goodscode=' + goods.Gdscode + '&amount=' + goods.amount + '&groupno=' + goods.groupno
            })
          }
        } else {
          toast.toast(res.message)
        }
      }).catch(error => {
        toast.toast(error.error)
      })
    },
  }
})
