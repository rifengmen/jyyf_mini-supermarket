// autoModule/pages/recharge/recharge.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // banner类型列表
    bannerTypeList: [],
    // 轮播点儿下标
    swiperCurrent: 0,
    // 卡号
    memcode: '',
    // 余额
    cardInfo: '',
    // 充值金额
    money: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      memcode: app.globalData.memcode,
      bannerTypeList: app.globalData.bannerTypeList,
    })
    // 获取banner列表
    // self.getBannerList()
    // 获取卡余额
    self.getCardInfo()
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

  // 修改轮播点儿
  swiperChange(e) {
    let self = this
    let { source, current } = e.detail
    if (source === 'autoplay' || source === 'touch') {
      self.setData({
        swiperCurrent: current
      })
    }
  },

  // 去banner详情
  toBannerDetail(e) {
    let self = this
    let banner = e.currentTarget.dataset.banner
    app.toBannerDetail(banner)
  },

  // 获取卡余额
  getCardInfo() {
    let self = this
    let data = {}
    API.mem.getMyCardInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cardInfo: res.data
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置充值金额
  setMoney(e) {
    let self = this
    self.setData({
      money: e.detail.value
    })
  },

  // 发送充值信息
  sendPay() {
    let self = this
    let money = self.data.money
    // 验证金额是否填写
    if (!money) {
      toast('请填写充值金额')
      return false
    }
    let data = {
      card_no: self.data.memcode,
      toMoney: money,
    }
    wx.showLoading({
      title: '请求等待中...',
      mask: true,
    });
    API.mem.reChargeToPay(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 充值支付
        self.toPay(res.data)
      } else {
        toast(res.message)
      }
    }).catch(error => {
      wx.hideLoading();
      toast(error.error)
    })
  },

  // 充值支付
  toPay(datas) {
    let self = this
    let data = {
      presentmoney: datas.presentmoney,
      card_no: datas.card_no,
      paymodeid: 7,
      paymoney: datas.paymoney,
      channel: "WX_MINI"
    }
    API.mem.reChargePay(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 微信支付
        self.wechatPay(res.data.beecloud.miniPayStr)
      } else {
        toast(res.message)
      }
    }).catch(error => {
      wx.hideLoading();
      toast(error.error)
    })
  },

  // 微信支付
  wechatPay(wechatstr) {
    let self = this
    wx.requestPayment({
      appId: wechatstr.appId,
      timeStamp: wechatstr.timeStamp,
      nonceStr: wechatstr.nonceStr,
      package: wechatstr.package,
      signType: wechatstr.signType,
      paySign: wechatstr.paySign,
      success: function (res) {
        wx.navigateBack()
        toast('充值成功，充值金额五分钟内到账')
      },
      fail: function (res) {
        toast('充值失败')
      },
    })
    wx.hideLoading();
  },
})
