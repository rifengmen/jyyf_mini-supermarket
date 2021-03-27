// userInfo/pages/balance/balance.js
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
    type: 'balance',
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
  // },

  // 获取余额详情
  getList (e) {
    let self = this
    let data = {
      memcode: app.globalData.memcode,
      startdate: e.detail
    }
    API.mem.listMoneyCardDtl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let datas = res.data
        datas.dataList.forEach(item => {
          item.name = item.changeType
          item.time = item.Saletime
          item.desc = item.Changemoney
        })
        self.setData({
          cardData: datas.Balancemoney,
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
