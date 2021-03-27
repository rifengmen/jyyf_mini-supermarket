// userInfo/pages/complaintDetail/complaintDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // id
    id: '',
    // 投诉建议类别
    type: 0,
    // 投诉建议类别列表
    typeList: app.globalData.typeList,
    // 详情
    complaintDetail: '',
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
    wx.setNavigationBarTitle({
      title: self.data.typeList[self.data.type]
    })
    // 获取详情
    self.getComplaintDetail()
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

  // 获取投诉建议详情
  getComplaintDetail () {
    let self = this
    let data = {
      id: self.data.id,
    }
    API.system.listSuggestionDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          complaintDetail: res.data,
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
