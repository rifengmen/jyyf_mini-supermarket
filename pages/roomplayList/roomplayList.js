// pages/roomplayList/roomplayList.js
const app = getApp()
import toast from '../../utils/toast'
import API from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求开关
    getFlag: false,
    // 查询起始房间号
    curStart: 0,
    // 每页条数
    maxRooms: 20,
    // 房间列表
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
    let self = this
    self.setData({
      getFlag: false,
      curStart: 0,
      roomplayList: [],
    })
    // 获取房间列表
    self.getRoomplayList()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    // 获取房间列表
    self.getRoomplayList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 获取房间列表
  getRoomplayList () {
    let self = this
    let start = self.data.roomplayList.length
    let data = {
      start: start,
      limit: self.data.maxRooms
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.miniLiveInfo.listLiveInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let roomplayList = self.data.roomplayList
        roomplayList.push(...res.data)
        self.setData({
          roomplayList: roomplayList
        })
      } else {
        toast(res.message)
      }
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
    }).catch(error => {
      toast(error.error)
    })
  },

  // 进房间
  toRoom (e) {
    let self = this
    let roomid = e.currentTarget.dataset.roomid
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 }))
    wx.navigateTo({
      url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + roomid + "&custom_params=" + customParams
    })
  },
})
