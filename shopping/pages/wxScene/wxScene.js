// shopping/pages/wxScene/wxScene.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 32位字符串，用来换取详情页参数
    scene: '',
    // goodsData,商品详情页参数
    goodsData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      scene: options.scene,
    })
    // 获取商品详情页参数
    self.getGoodsData()
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

  // 获取商品详情页参数
  getGoodsData () {
    let self = this
    let data = {
      uuid: self.data.scene
    }
    API.info.getUrlParamScene(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let goodsData = res.data
        self.setData({
          goodsData: goodsData,
        })
        wx.redirectTo({
          url: '/shopping/pages/goodsDetail/goodsDetail?Gdscode=' + goodsData.Gdscode + '&promotemode=' + goodsData.promotemode + '&title=' + goodsData.title + '&deptname=' + goodsData.deptname + '&deptcode=' + goodsData.deptcode
        })
      } else {
        toast(res.message)
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
      wx.redirectTo({
        url: url
      })
    }).catch(error => {
      toast(error.error)
    })
  },
})
