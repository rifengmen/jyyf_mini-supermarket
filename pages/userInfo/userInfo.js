// pages/userInfo/userInfo.js
const app = getApp()
const toast = require("../../utils/toast")
const utils = require("../../utils/util")
import API from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
    frontColor: '#ffffff',
    // 主题背景色
    home_bgcolor: '#71d793',
    // 身份信息，0：顾客；1：配送员；2：团长
    role: 0,
    // 身份标识列表
    roleList: app.globalData.roleList,
    // 用户头像
    userImg: '',
    // 支付开通标志
    coflag: '',
    // openid
    openid: '',
    // 用户名称
    memname: '',
    // 会员号
    memcode: '',
    // 余额
    cardInfo: '',
    // 电子券
    tickNum: 0,
    // 积分
    score: '',
    // 订单状态列表
    statusList: app.globalData.statusList,
    // 消息类别标识，0：个人消息，10：内部功能新订单消息
    businessflag: 10,
    // 未读消息提示，messageNum
    messageNum: 0,
    // 内部功能未读消息提示，internalMessageNum
    internalMessageNum: 0,
    // 类别,0：投诉建议；1:商品建议；2:我要投诉；
    type: 1,
    // 投诉类别列表
    typeList: app.globalData.typeList,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let openid = app.globalData.openid
    if (openid) {
      self.setData({
        openid: openid
      })
    }
    // 是否授权登录
    self.isAuthor()
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
    let self = this
    let home_bgcolor = app.globalData.home_bgcolor || '#71d793'
    let openid = app.globalData.openid
    let memcode = app.globalData.memcode
    let userImg = app.globalData.userImg
    let memname = app.globalData.memname
    let coflag = app.globalData.coflag
    let role = Number(app.globalData.role)
    self.setData({
      home_bgcolor: home_bgcolor,
      openid: openid,
      memcode: memcode,
      userImg: userImg,
      memname: memname,
      coflag: coflag,
      role: role,
    })
    // 设置主题背景色
    wx.setNavigationBarColor({
      frontColor: self.data.frontColor,
      backgroundColor: self.data.home_bgcolor,
    })
    if (openid) {
      // 初始化
      self.init()
    }
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

  // 是否需要授权
  isAuthor () {
    let self = this
    if (!self.data.openid) {
      wx.navigateTo({
        url: '/pages/author/author'
      })
      return false
    }
  },

  // 初始化
  init () {
    let self = this
    // 获取订单数量（内部功能用）
    self.getOrderNum()
    // 获取电子券数量
    self.getTickNum()
    // 获取卡余额
    self.getCardInfo()
    // 获取积分
    self.getScore()
    // 更新订单状态列表
    self.getStatusList()
    // 设置未读消息数量
    self.setMessageNum()
    // 设置内部功能未读消息数量
    self.setInternalMessageList()
    // 更新购物车
    self.getCartCount()
  },

  // 获取订单数量（内部功能用）
  getOrderNum () {
    let self = this
    let role = self.data.role
    let data = {
      role: role,
    }
    API.bill.getOrderNum(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let roleList = self.data.roleList
        roleList[role].num = res.data
        self.setData({
          roleList: roleList,
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取电子券数量
  getTickNum () {
    let self = this
    let data = {}
    API.mem.listCoupon(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          tickNum: res.data.length
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取卡余额
  getCardInfo () {
    let self = this
    let data = {}
    API.mem.getMyCardInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          cardInfo: res.data
        })
      }
    }).catch(error => {
      toast.toast(error.error)
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
      toast.toast(error.error)
    })
  },

  // 更新订单状态列表
  getStatusList () {
    let self = this
    let statusList = self.data.statusList
    statusList.forEach(item => {
      self.getOrderList(item.type)
    })
  },

  // 获取订单数量
  getOrderList (type) {
    let self = this
    let data = {
      Starttime: '2020-01-01',
      statusType: type,
    }
    API.bill.listMyOrder(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let statusList = self.data.statusList
        statusList.forEach(item => {
          if (item.type === type) {
            item.num = res.rowCount
          }
        })
        self.setData({
          statusList: statusList
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置未读消息数量
  setMessageNum () {
    let self = this
    let data = {
      messageFlag: 0,
    }
    API.info.listmessage(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          messageNum: res.rowCount
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置内部功能未读消息数量
  setInternalMessageList () {
    let self = this
    let data = {
      businessflag: self.data.businessflag,
      messageFlag: 0,
    }
    API.info.listmessage(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          internalMessageNum: res.rowCount
        })
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 更新购物车
  getCartCount () {
    let self = this
    let data = {}
    API.bill.getCarProductCount(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let index = 2
        if (res.data) {
          if (res.data.data) {
            wx.setTabBarBadge({
              index: index,
              text: (res.data.data).toString()
            })
          } else {
            wx.removeTabBarBadge({
              index: index
            })
          }
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
