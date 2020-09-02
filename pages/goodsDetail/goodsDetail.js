// pages/goodsDetail/goodsDetail.js
const app = getApp()
const request = require("../../utils/request.js")
const toast = require("../../utils/toast.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品id
    Gdscode: '',
    // title
    title: '',
    // 会员类型，1：批发；2：普通
    Utype: 2,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 商品详情
    goodsDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      deptname: app.globalData.deptname,
      deptcode: app.globalData.deptcode,
      Gdscode: options.Gdscode,
      title: options.title
    })
    // 设置title
    wx.setNavigationBarTitle({
      title: self.data.title, 
    })
    // 获取商品详情
    self.getGoodsDetail()
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

  // 获取商品详情
  getGoodsDetail () {
    let self = this
    let data = {
      Gdscode: self.data.Gdscode,
      Utype: self.data.Utype,
      Deptcode: self.data.deptcode
    }
    request.http('info/goods.do?method=getProductDetails', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          goodsDetail: res.data
        })
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})