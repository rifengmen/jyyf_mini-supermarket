// scan/pages/orderDetail/orderDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 店铺信息
    deptcode: '',
    deptname: '',
    // 流水号
    flowno: '',
    // 下单日期
    recordtime: '',
    // 扫码购订单详情
    orderDetail: '',
    // 订单商品列表
    goodsList: '',
    // 还需支付金额
    shouldpaymoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      deptcode: options.deptcode,
      deptname: options.deptname,
      flowno: options.flowno,
      recordtime: options.recordtime,
    })
    // 获取扫码购订单详情
    self.getOrderDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 获取订单详情
  getOrderDetail () {
    let self = this
    let data = {
      ordernum: self.data.flowno,
      bmcode: self.data.deptcode
    }
    API.invest.listMicroFlowDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let orderDetail = res.data
        self.setData({
          orderDetail: orderDetail,
          goodsList: orderDetail.OrderDetail,
          shouldpaymoney: (orderDetail.shouldmoney - orderDetail.paymoney).toFixed(2)
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 取消按钮
  cancelBtn () {
    let self = this
    let scanCancelBtn = self.selectComponent('#scanCancelBtn')
    scanCancelBtn.isCancel()
  },
})
