// pages/roomplayList/roomplayList.js
const app = getApp()
const request = require("../../utils/request")
const toast = require("../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curStart: 0,
    maxRooms: 12,
    roomplayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // 获取房间列表
    self.getRoomplayList()
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

  // 获取房间列表
  getRoomplayList () {
    let self = this
    let newstart = self.data.curStart + self.data.roomplayList.length
    let data = {
      start: newstart,
      limit: self.data.maxRooms
    }
    request.http('miniLiveInfo.do?method=listLiveInfo', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          roomplayList: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 进房间
  toRoom (e) {
    let self = this
    let roomid = e.currentTarget.dataset.roomid
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/login/login', pid: 1 }))
    wx.navigateTo({
      url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + roomid + "&custom_params=${customParams}"
    })
  },
})
