// autoModule/pages/tickDetail/tickDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 券id
    tickid: '',
    // 开始使用时间
    startdate: '',
    // 结束使用时间
    enddate: '',
    // 限用名称
    limitname: '',
    // 限用门店
    limitdeptcode: '',
    // 禁用日
    notuseday: '',
    // 券名称
    tickname: '',
    // 起用金额
    minsalemoney: '',
    // 券面额
    usemoney: '',
    // 券类别
    tickettype: '',
    // 券类别名称
    tickettypename: '',
    // 使用规则
    dealflagdescription: '',
    // 电子券详情
    tickDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let tick = JSON.parse(options.tick)
    self.setData({
      from: options.from,
      tickid: tick.onlinetickid,
      startdate: tick.startdate,
      enddate: tick.enddate,
      limitname: tick.limitname,
      limitdeptcode: tick.limitdeptcode,
      notuseday: tick.notuseday,
      tickname: tick.tickname,
      minsalemoney: tick.minsalemoney,
      usemoney: tick.usemoney,
      tickettype: tick.tickettype,
      tickettypename: tick.tickettypename,
      dealflagdescription: tick.dealflagdescription,
    })
    // 获取电子券详情
    self.getTickDetail()
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

  // 获取电子券详情
  getTickDetail () {
    let self = this
    let data = {
      tickid: self.data.tickid,
    }
    API.mem.getCouponDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let tickDetail = res.data
        let residuecount = tickDetail.totalcount - tickDetail.havepaniccount
        if (residuecount < 0) {
          residuecount = 0
        }
        tickDetail.residuecount = residuecount
        self.setData({
          tickDetail: tickDetail,
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
