// message/pages/detail/detail.js
const app = getApp()
const toast = require("../../../utils/toast")
const utils = require("../../../utils/util")
import API from '../../../api/index'

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
  // onShareAppMessage: function () {
  //
  // },

  // 获取公告详情
  getNoticeDetail () {
    let self = this
    let data = {
      id: self.data.id
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.info.listNoticeDtlForWX(data).then(result => {
      let res = result.data
      // 设置详情
      self.setDetail(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取消息详情
  getMessageDetail () {
    let self = this
    let data = {
      id: self.data.id
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.info.listDtl(data).then(result => {
      let res = result.data
      // 设置详情
      self.setDetail(res)
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置详情
  setDetail (res) {
    let self = this
    if (res.flag === 1) {
      let nodes = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;float:left;margin: 0 auto"')
      self.setData({
        detail: res.data,
        nodes: nodes,
      })
    } else {
      toast.toast(res.message)
    }
    wx.hideLoading()
  },

  // 图片放大预览
  previewImage (e) {
    let self = this
    let imgList = self.data.detail.content.match(/<img[^>]*src=['"]([^'"]+)[^>]*>/gi)
    let srcList = []
    imgList.forEach(item => {
      item.replace(/<img[^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        srcList.push(capture)
      })
    })
    let current = e.target.src
    console.log(current, 'current')
    console.log(e, 'e')
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: srcList // 需要预览图片http链接列表
    })
  },
})
