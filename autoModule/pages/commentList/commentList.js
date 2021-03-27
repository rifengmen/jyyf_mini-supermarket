// autoModule/pages/commentList/commentList.js
const app = getApp()
import toast from '../../../utils/toast'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求开关
    getFlag: false,
    // 页面title
    title: '',
    // 从哪里来/组件使用的地方
    from: '',
    // 商品code
    gdscode: '',
    // 订单评价类型列表
    EtypeList: app.globalData.EtypeList,
    // EType,评论类型（0全部，好评1，中评2，差评3）
    EType: 0,
    // 评价列表
    commentList: [],
    // 页码
    page: 1,
    // 每页条数
    count: 16,
    // 总条数
    rowCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let title = options.title
    let from = options.from
    let gdscode = options.gdscode || ''
    self.setData({
      title: title,
      from: from,
      gdscode: gdscode,
    })
    // 设置title
    wx.setNavigationBarTitle({
      title: self.data.title,
    })
    if (from === 'goodsDetail') {
      // 获取商品评价列表
      self.getGoodsCommentList()
    } else if (from === 'auto') {
      // 获取我的评价列表
      self.getMyCommentList()
    }
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
      page: 1,
      commentList: [],
    })
    let from = self.data.from
    if (from === 'goodsDetail') {
      // 获取商品评价列表
      self.getGoodsCommentList()
    } else if (from === 'auto') {
      // 获取我的评价列表
      self.getMyCommentList()
    }
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    // 计算总页数
    let totalPage = Math.ceil(self.data.rowCount / self.data.count)
    // 下一页
    let page = self.data.page
    page++
    self.setData({
      page: page
    })
    if (self.data.page > totalPage) {
      toast('暂无更多')
      return false
    }
    let from = self.data.from
    if (from === 'goodsDetail') {
      // 获取商品评价列表
      self.getGoodsCommentList()
    } else if (from === 'auto') {
      // 获取我的评价列表
      self.getMyCommentList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //
  // },

  // 切换选项
  setEType (e) {
    let self = this
    let EType = e.currentTarget.dataset.type
    self.setData({
      EType: EType,
      page: 1,
      commentList: [],
    })
    let from = self.data.from
    if (from === 'goodsDetail') {
      // 获取商品评价列表
      self.getGoodsCommentList()
    } else if (from === 'auto') {
      // 获取我的评价列表
      self.getMyCommentList()
    }
  },

  // 获取商品评价列表
  getGoodsCommentList () {
    let self = this
    let data = {
      gdscode: self.data.gdscode,
      EType: self.data.EType,
      page: self.data.page,
      pageSize: self.data.count
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.bill.getProductEvaluation(data).then(result => {
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        if (self.data && self.data.commentList) {
          let commentList = self.data.commentList
          commentList.push(...res.data)
          self.setData({
            commentList: commentList,
            rowCount: res.rowCount
          })
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取我的评价列表
  getMyCommentList () {
    let self = this
    let data = {}
    API.bill.getProductEvaluation(data).then(result => {
      // 设置请求开关
      self.setData({
        getFlag: true
      })
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        if (self.data && self.data.commentList) {
          let commentList = self.data.commentList
          commentList.push(...res.data)
          self.setData({
            commentList: commentList,
            rowCount: res.rowCount
          })
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
