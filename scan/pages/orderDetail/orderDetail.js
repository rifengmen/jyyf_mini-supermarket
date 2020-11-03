// scan/pages/orderDetail/orderDetail.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 店铺信息
    deptcode: '',
    // 流水号
    flowno: '',
    // 扫码购订单详情
    orderDetail: '',
    // 订单商品列表
    goodsList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      deptcode: options.deptcode,
      flowno: options.flowno,
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

  // 获取扫码购订单详情
  getOrderDetail () {
    let self = this
    let data = {
      flowno: self.data.flowno,
      deptcode: self.data.deptcode
    }
    request.http('invest/microFlow.do?method=listMicroFlowDtl', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          orderDetail: res.data,
          goodsList: res.data.gdscodeList
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 取消按钮
  cancelBtn () {
    let self = this
    let scanCancelBtn = self.selectComponent('#scanCancelBtn')
    scanCancelBtn.isCancel()
  },
})
