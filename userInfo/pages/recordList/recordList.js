// userInfo/pages/recordList/recordList.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求开关
    getFlag: false,
    // 评价列表
    recordList: [],
    // 页码
    page: 1,
    // 每页条数
    count: 15,
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
      recordList: [],
    })
    // 获取评价列表
    self.getRecordList()
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
    // 获取评价列表
    self.getRecordList()
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
      recordList: [],
    })
    // 获取评价列表
    self.getRecordList()
  },

  // 获取评价列表
  getRecordList () {
    let self = this
    let data = {
      Cardnum: app.globalData.memcode,
      Startday: self.data.startdate,
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
    request.http('mem/member.do?method=listMemberConsum', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let recordList = self.data.recordList
        recordList.push(...res.data)
        self.setData({
          recordList: recordList,
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
