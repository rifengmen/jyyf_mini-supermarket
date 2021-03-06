// userInfo/pages/addComplaint/addComplaint.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 详情
    content: '',
    // 投诉建议类别
    type: 0,
    // 请求开关
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      type: options.type,
      title: options.title
    })
    wx.setNavigationBarTitle({
      title: options.title
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

  // 设置投诉建议内容
  setContent (e) {
    let self = this
    self.setData({
      content: e.detail.value.trim()
    })
  },

  // 添加投诉建议
  sendContent () {
    let self = this
    let content = self.data.content
    // 验证评价内容
    if (!content) {
      toast('请填写内容')
      return false
    }
    let data = {
      type: self.data.type,
      Content: content,
    }
    if (!self.data.flag) {
      return false
    }
    // 请求开关
    self.setData({
      flag: false
    })
    API.system.addSuggestion(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateBack()
      }
      toast(res.message)
      // 请求开关
      self.setData({
        flag: true
      })
    }).catch(error => {
      toast(error.error)
    })
  },
})
