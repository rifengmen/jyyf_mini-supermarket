// userInfo/pages/score/score.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询开始时间
    startdate: '',
    // 卡片信息
    cardData: 0,
    // 记录列表
    list: [],
    // 模板传入类型
    type: 'score',
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取积分详情
  getList (e) {
    let self = this
    let data = {
      memcode: app.globalData.memcode,
      startdate: e.detail
    }
    API.mem.listScoreDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let datas = res.data
        datas.dataList.forEach(item => {
          item.name = item.changetype
          item.time = item.saletime
          item.desc = item.Score
        })
        self.setData({
          cardData: datas.Score,
          list: datas.dataList
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
