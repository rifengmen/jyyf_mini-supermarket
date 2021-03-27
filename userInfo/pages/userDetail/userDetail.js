// userInfo/pages/userDetail/userDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户昵称
    memname: '',
    // vip，会员等级
    vip: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let memnameArr = app.globalData.memname
    let memname = app.globalData.memname
    let vip = memnameArr.slice(memnameArr.lastIndexOf('(') + 1, -1)
    self.setData({
      memname: memname,
      vip: vip
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

  // 设置用户昵称
  setMemname (e) {
    let self = this
    self.setData({
      memname: e.detail.value
    })
  },

  // 确认修改弹窗
  isModifyMemname () {
    let self = this
    wx.showModal({
      title: '提示',
      content: '确认修改您的昵称吗？',
      success: res => {
        // 确认
        if (res.confirm) {
          // 修改用户昵称
          self.modifyMemname()
        }
      }
    })
  },

  // 修改用户昵称
  modifyMemname () {
    let self= this
    let data ={
      memName: self.data.memname
    }
    API.system.modifyname(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        app.globalData.memname = self.data.memname + '(' + self.data.vip + ')'
        wx.navigateBack()
      }
      toast(res.message)
    }).catch(error => {
      toast(error.error)
    })
  },
})
