// pages/scan/editorOrder/editorOrder.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 支付方式,true:微信，false：储值卡
    payFlag: true,
    // 流水号
    flowno: '',
    // 店铺信息
    deptcode: '',
    deptname: '',
    // 订单详情
    scanOrderDetail: '',
    // 支付方式列表
    paymodeList: [],
    // 支付信息
    paylist: [],
    // 支付方式
    paymodeid: '7',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      flowno: options.flowno,
      deptcode: options.deptcode,
      deptname: options.deptname,
    })
    // 获取订单详情
    self.getScanOrderDetail()
    // 获取支付方式列表
    self.getPaymodeList()
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
  onShareAppMessage: function () {

  },

  // 获取订单详情
  getScanOrderDetail () {
    let self = this
    let data = {
      flowno: self.data.flowno,
      deptcode: self.data.deptcode
    }
    request.http('invest/microFlow/listMicroFlowDtl', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          sacnOrderDetail: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 切换支付方式
  radioChange () {
    let self = this
    self.setData({
      payFlag: !self.data.payFlag
    })
  },

  // 获取支付方式列表
  getPaymodeList () {
    let self = this
    let data = {
      flowno: self.data.flowno,
      shopCode: self.data.deptcode
    }
    request.http('invest/microFlow/getMicroFlowPayMoney', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          paymodeList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
