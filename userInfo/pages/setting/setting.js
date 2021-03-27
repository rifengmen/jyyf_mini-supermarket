// userInfo/pages/setting/setting.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 类别,0：投诉建议；1:商品建议；2:我要投诉；
    type: 2,
    // 投诉类别列表
    typeList: app.globalData.typeList,
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
  // }

  // 确认解绑弹窗
  isRemove () {
    let self= this
    wx.showModal({
      title: '提示',
      content: '您确认解除绑定吗？（解除绑定后只能以游客身份浏览）',
      success: res => {
        // 确认
        if (res.confirm) {
          // 手机号解除绑定
          self.remove()
        }
      }
    })
  },

  // 手机号解除绑定
  remove () {
    let self = this
    let data = {
      wxID: app.globalData.openid
    }
    API.system.unBindOpenID(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 清空基础信息
        app.globalData.openid = ''
        app.globalData.userid = ''
        app.globalData.memcode = ''
        app.globalData.memname = ''
        app.globalData.mobile = ''
        app.globalData.role = ''
        wx.reLaunch({
          url: "/pages/index/index"
        })
      }
      toast(res.message)
    }).catch(error => {
      toast(error.error)
    })
  },
})
