// userInfo/pages/complaintList/complaintList.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求开关
    getFlag: false,
    // 投诉建议类别,0：投诉建议；1:商品建议；2:我要投诉；
    type: 0,
    // 投诉建议类别列表
    typeList: app.globalData.typeList,
    // title
    title: '',
    // 投诉列表
    complaintList: [],
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
    self.setData({
      type: parseFloat(options.type),
      title: options.title
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    // 获取投诉列表
    self.getComplaintList()
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
      complaintList: [],
    })
    // 获取投诉列表
    self.getComplaintList()
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
      toast.toast('暂无更多')
      return false
    }
    // 获取投诉列表
    self.getComplaintList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 获取投诉建议列表
  getComplaintList () {
    let self = this
    let data = {
      type: self.data.type,
      page: self.data.page,
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
    API.system.listSuggestion(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let complaintList = self.data.complaintList
        complaintList.push(...res.data)
        self.setData({
          complaintList: complaintList,
          rowCount: res.rowCount
        })
      } else {
        toast.toast(res.message)
      }
      wx.hideLoading()
      // 设置请求开关
      self.setData({
        getFlag: true
      })
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
