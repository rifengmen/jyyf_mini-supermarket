// autoModule/pages/signIn/signIn.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
    frontColor: '#ffffff',
    // 主题背景色
    home_bgcolor: '',
    // sign,签到信息
    sign: '',
    // 会员号
    memcode: '',
    // 积分
    score: '',
    // 推荐商品列表
    recommendList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      home_bgcolor: app.globalData.home_bgcolor || '#71d793',
      memcode: app.globalData.memcode,
    })
    // 设置主题背景色
    wx.setNavigationBarColor({
      frontColor: self.data.frontColor,
      backgroundColor: self.data.home_bgcolor,
    })
    // 签到
    self.signIn()
    // 获取推荐商品列表
    self.getRecommendList()
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

  // 签到
  signIn () {
    let self = this
    let data = {
      date: utils.formatDate(new Date())
    }
    API.system.CustomerSign(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          sign: res.data
        })
      } else {
        toast(res.message)
      }
      // 获取积分
      self.getScore()
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取推荐商品列表
  getRecommendList () {
    let self = this
    let data = {}
    API.mem.getMyCardInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          recommendList: res.data
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取积分
  getScore () {
    let self = this
    let data = {
      memcode: app.globalData.memcode,
      startdate: utils.formatTime(new Date())
    }
    API.mem.listScoreDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          score: res.data
        })
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
