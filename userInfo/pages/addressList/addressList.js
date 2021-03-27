// userInfo/pages/addressList/addressList.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址列表
    addressList: [],
    // 从哪里来/组件使用的地方
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
  // onShareAppMessage: function () {
  //
  // },

  // 获取地址列表
  getAddressList () {
    let self = this
    if (self.data.from === 'editorOrder') {
      // 当前门店可用地址列表
      self.listUserAdressForDept()
    } else {
      // 我的地址列表
      self.listUserAdress()
    }
  },

  // 我的地址列表
  listUserAdress () {
    let self = this
    let data = {
      tmFlag: self.data.tmFlag
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.system.listUserAdress(data).then(result => {
      let res = result.data
      // 设置地址列表
      self.setAddressList(res)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 当前门店可用地址列表
  listUserAdressForDept () {
    let self = this
    let data = {
      tmFlag: self.data.tmFlag
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    // 设置请求开关
    self.setData({
      getFlag: false
    })
    API.system.listUserAdressForDept(data).then(result => {
      let res = result.data
      // 设置地址列表
      self.setAddressList(res)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置地址列表
  setAddressList (res) {
    let self = this
    // 设置请求开关
    self.setData({
      getFlag: true
    })
    wx.hideLoading()
    if (res.flag === 1) {
      self.setData({
        addressList: res.data
      })
    } else {
      toast(res.message)
    }
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

  // 修改是否默认地址
  setIsdefault (e) {
    let self = this
    let address = e.currentTarget.dataset.address
    let data = {
      AddressID: address.id,
      auditMark: address.auditMark,
    }
    if (address.isdefault) {
      // 取消默认地址
      self.cancelDefaultAddress(data, address)
    } else {
      // 保存默认地址
      self.saveDefaultAddress(data, address)
    }

  },

  // 保存默认地址
  saveDefaultAddress (data, address) {
    let self = this
    API.system.SetDefaultAddress(data).then(result => {
      let res = result.data
      // 设置默认地址
      self.setDefaultAddress(res, address)
      toast(res.message)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 取消默认地址
  cancelDefaultAddress (data, address) {
    let self = this
    API.system.CancelDefaultAddress(data).then(result => {
      let res = result.data
      // 设置默认地址
      self.setDefaultAddress(res, address)
      toast(res.message)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置默认地址
  setDefaultAddress (res, address) {
    let self = this
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
  },

  // 删除按钮
  delete (e) {
    let self = this
    let address = e.currentTarget.dataset.address
    // 确认弹窗
    wx.showModal({
      title: '提示',
      content: '您确定要删除这个地址吗？',
      success: res => {
        // 确认
        if (res.confirm) {
          // 判断地址类型,auditMark,0:自提点；1:收货地址
          if (address.auditMark) {
            // 删除收货地址
            self.delAddress(address)
          } else {
            // 取消收藏自提点
            self.collectDept(address)
          }
        }
      }
    })
  },

  // 删除收货地址
  delAddress (address) {
    let self = this
    let data = {
      Id: address.id
    }
    API.system.delAddress(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 获取地址列表
        self.getAddressList()
        toast(res.message)
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 取消收藏自提点
  collectDept (address) {
    let self = this
    let data = {
      flag: 1, // 0:收藏；1：取消
      addressid: address.id
    }
    API.system.collectDept(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 获取地址列表
        self.getAddressList()
        toast('删除成功!')
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 去编辑地址页面
  toEditorAddress (e) {
    let self = this
    app.globalData.addressDetail = e.currentTarget.dataset.address
    wx.navigateTo({
      url: '/userInfo/pages/editorAddress/editorAddress?id=' + e.currentTarget.dataset.address.id + '&from=' + self.data.from,
    })
  },
})
