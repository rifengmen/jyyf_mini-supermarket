// pages/userInfo/remove/remove.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 确认解绑弹窗
  isRemove () {
    let self= this
    wx.showModal({
      title: '提示',
      content: '您确认解除绑定吗？（解除绑定后只能以游客身份浏览）',
      success: res=>{
        if (res.confirm) {
          // 解除绑定
          self.remove()
        }
      }
    })
  },

  // 解除绑定
  remove () {
    let self = this
    let data = {
      wxID: app.globalData.openid
    }
    request.http('system/customlogin.do?method=unBindOpenID', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.reLaunch({
          url: "/pages/login/login"
        })
      }
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
