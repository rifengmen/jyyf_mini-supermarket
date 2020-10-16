// pages/userInfo/addressList/addressList.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址列表
    addressList: [],
    // 来自哪儿
    from: '',
    // 请求开关
    getFlag: false,
    // 团秒标志，0：非团秒商品
    tmFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      from: options.from || '',
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
    let self = this
    // 获取地址列表
    self.getAddressList()
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

  // 获取地址列表
  getAddressList () {
    let self = this
    let data = {
      tmFlag: self.data.tmFlag
    }
    let url = 'system/myuser.do?method=listUserAdress'
    if (self.data.from === 'editorOrder') {
      url = 'system/myuser.do?method=listUserAdressForDept'
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    request.http(url, data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          addressList: res.data
        })
      } else {
        toast.toast(res.message)
      }
      wx.hideLoading()
      // 设置请求开关
      self.setData({
        getFlag: true
      })
    }).catch(error => {
      toast.toast(error.error)
    })
    // Latitude: null
    // Longitude: null
    // address: "迎泽南街测试地址001新"
    // areaid: 3
    // areaname: "迎泽南街"
    // id: 61
    // isdefault: 1
    // mapaddress: null
    // parentAreaName: "迎泽区"
    // parentAreaid: 1
    // phone: "18735605086"
    // username: "门日峰"
  },

  // 设置收货地址
  setAddress (e) {
    let self = this
    let address = e.currentTarget.dataset.address
    if (address.sendflag && self.data.from === 'editorOrder') {
      app.globalData.addressId = address.id
      wx.navigateBack()
    }
  },

  // 设置/取消默认地址
  setIsdefault (e) {
    let self = this
    let address = e.currentTarget.dataset.address
    let data = {
      AddressID: address.id,
    }
    let url
    if (address.isdefault) {
      url = 'system/myuser.do?method=CancelDefaultAddress'
    } else {
      url = 'system/myuser.do?method=SetDefaultAddress'
    }
    request.http(url, data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let addressList = self.data.addressList
        addressList.forEach(item => {
          item.isdefault = 0
        })
        addressList.forEach(item => {
          if (item.id === address.id) {
            if (address.isdefault) {
              item.isdefault = 0
            } else {
              item.isdefault = 1
            }
          }
        })
        self.setData({
          addressList: addressList
        })
      }
      toast.toast(res.message)
    }).catch(error => {
      toast.toast(error.erro )
    })
  },

  // 去编辑地址页面
  toEditorAddress (e) {
    let self = this
    app.globalData.addressDetail = e.currentTarget.dataset.address
    wx.navigateTo({
      url: '/pages/userInfo/editorAddress/editorAddress?id=' + e.currentTarget.dataset.address.id + '&from=' + self.data.from,
    })
  },
})
