// pages/message/detail/detail.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 信息id
    id: '',
    // 详情种类 公告 消息
    type: '',
    // 信息详情
    detail: '',
    // 富文本
    nodes: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      id: options.id,
      type: options.type,
    })
    let title = ''
    let type = self.data.type
    if (type === 'notice') {
      title = '公告详情'
      // 获取公告详情
      self.getNoticeDetail()
    } else if (type === 'message') {
      title = '消息详情'
      // 获取消息详情
      self.getMessageDetail()
    }
    wx.setNavigationBarTitle({
      title: title
    })
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

  // 获取公告详情
  getNoticeDetail () {
    let self = this
    let data = {
      id: self.data.id
    }
    let url = 'info/InformationController.do?method=listNoticeDtlForWX'
    // 获取详情
    self.getDetail(url, data)
  },

  // 获取消息详情
  getMessageDetail () {
    let self = this
    let data = {
      id: self.data.id
    }
    let url = 'info/InformationController.do?method=listDtl'
    // 获取详情
    self.getDetail(url, data)
  },

  // 获取详情
  getDetail (url, data) {
    let self = this
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    request.http(url, data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let nodes = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;float:left;margin: 0 auto"')
        let detail = res.data
        if (self.data.type === 'notice') {
          detail.addtime = detail.pubdate
        }
        self.setData({
          detail: detail,
          nodes: nodes,
        })
        wx.hideLoading()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
