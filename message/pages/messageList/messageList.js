// message/pages/messageList/messageList.js
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
    // 消息类别标识，0：个人消息，10：内部功能新订单消息
    businessflag: 0,
    // 消息列表
    messageList: [],
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
    self.setData({
      businessflag: options.businessflag || 0,
    })
    // 获取消息列表
    self.getMessageList()
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
      messageList: [],
    })
    // 获取消息列表
    self.getMessageList()
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
    // 获取消息列表
    self.getMessageList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 获取消息列表
  getMessageList () {
    let self = this
    let data = {
      businessflag: self.data.businessflag,
      messageFlag: 1,
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
    API.info.listmessage(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let messageList = res.data
        messageList.forEach(item => {
          item.prizeName = item.title
          item.prizeDate = item.addtime
          item.readflag = item.flag
        })
        let _messageList = self.data.messageList
        _messageList.push(... messageList)
        self.setData({
          messageList: _messageList,
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

  // 设置阅读
  setList (e) {
    let self = this
    let id = e.detail
    let messageList = self.data.messageList
    messageList.forEach(item => {
      if (item.id === id) {
        item.readflag = 1
      }
    })
    self.setData({
      messageList: messageList
    })
  },
})
