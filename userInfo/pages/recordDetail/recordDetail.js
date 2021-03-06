// userInfo/pages/recordDetail/recordDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // record
    flowno: '',
    deptcode: '',
    deptname: '',
    saletime: '',
    // 详情
    recordDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      flowno: options.flowno,
      deptcode: options.deptcode,
      deptname: options.deptname,
      saletime: options.saletime,
    })
    // 获取消费详情
    self.getRecordDetail()
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

  // 获取消费详情
  getRecordDetail () {
    let self = this
    let data = {
      Flowno: self.data.flowno,
      Deptcode: self.data.deptcode
    }
    API.mem.listDetails(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          recordDetail: res.data.detailsList
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
