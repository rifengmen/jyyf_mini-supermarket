// autoModule/pages/lotteryList/lotteryList.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求开关
    getFlag: false,
    // 中奖记录列表
    lotteryList: [],
    // 查询开始时间
    startdate: '',
    // 页码
    page: 1,
    // 每页条数
    count: 16,
    // 总条数
    rowCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
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
    let self = this
    self.setData({
      page: 1,
      lotteryList: [],
    })
    // 获取中奖记录列表
    self.getLotteryList()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    // 计算总页数
    let totalPage = Math.ceil(self.data.rowCount / self.data.count)
    // 下一页
    let page = self.data.page
    page++
    self.setData({
      page: page
    })
    if (self.data.page > totalPage) {
      toast('暂无更多')
      return false
    }
    // 获取中奖记录列表
    self.getLotteryList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 设置查询开始日期
  setStartdate (e) {
    let self = this
    self.setData({
      startdate: e.detail,
      page: 1,
      lotteryList: [],
    })
    // 获取中奖记录列表
    self.getLotteryList()
  },

  // 获取中奖记录列表
  getLotteryList () {
    let self = this
    let data = {
      startDate: self.data.startdate,
      Page: self.data.page,
      pageSize: self.data.count
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.system.listPrizeLog(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let lotteryList = self.data.lotteryList
        lotteryList.push(...res.data)
        self.setData({
          lotteryList: lotteryList,
          rowCount: res.rowCount
        })
      } else {
        toast(res.message)
      }
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
    }).catch(error => {
      toast(error.error)
    })
  },
})
