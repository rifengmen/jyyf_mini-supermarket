// message/pages/detail/detail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
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
      // msg_type,公告类别，0：根据id查询普通公告详情； 1：查询关于我们；  2：查询联系我们
      msg_type: 0,
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
      toast(error.error)
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
      toast(error.error)
    })
  },

  // 设置详情
  setDetail (res) {
    let self = this
    wx.hideLoading()
    if (res.flag === 1) {
      let nodes = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;float:left;margin: 0 auto"')
      self.setData({
        detail: res.data,
        nodes: nodes,
      })
    } else {
      toast(res.message)
    }
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
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: srcList // 需要预览图片http链接列表
    })
  },
})
