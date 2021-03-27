// autoModule/pages/addComment/addComment.js
const app = getApp()
import toast from '../../../utils/toast'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 评价类别列表
    type: [
      {name: '好评', type: 1},
      {name: '中评', type: 2},
      {name: '差评', type: 3},
    ],
    // 商品code
    Gdscode: '',
    // 商品名称
    Gdsname: '',
    // 评价详情
    content: '',
    // 评价类别
    EType: 1,
    // 请求开关
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      Gdscode: options.Gdscode,
      Gdsname: options.Gdsname,
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

  // 设置评价类型
  setEType (e) {
    let self = this
    self.setData({
      EType: e.currentTarget.dataset.type
    })
  },

  // 设置评价内容
  setContent (e) {
    let self = this
    self.setData({
      content: e.detail.value.trim()
    })
  },

  // 添加评价
  sendContent () {
    let self = this
    let content = self.data.content
    // 验证评价内容
    if (!content) {
      toast('请填写评价内容')
      return false
    }
    let data = {
      Gdscode: self.data.Gdscode,
      Gdsname: self.data.Gdsname,
      EType: self.data.EType,
      content: content,
    }
    if (!self.data.flag) {
      return false
    }
    // 请求开关
    self.setData({
      flag: false
    })
    API.bill.addProductEvaluation(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateBack()
      }
      toast(res.message)
      // 请求开关
      self.setData({
        flag: true
      })
    }).catch(error => {
      toast(error.error)
    })
  },
})
