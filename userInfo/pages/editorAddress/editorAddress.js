// userInfo/pages/editorAddress/editorAddress.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址id
    id: '',
    // 地址详情(修改地址时用)
    address: '',
    // 从哪里来/组件使用的地方
    from: '',
    // 名字
    addressUsername: '',
    // 手机号
    addressPhone: '',
    // 地址类型,0:自提点,1:收货地址
    addressType: 1,
    // 定位
    gps: '',
    //  地图信息
    mapaddress: '',
    // 纬度
    latitude: 0,
    // 经度
    longitude: 0,
    // 自提点列表
    siteList: [],
    // 自提点id
    siteid: '',
    // 详细地址
    addressAddress: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      id: options.id || '',
      from: options.from || '',
    })
    if (self.data.id) {
      let address = app.globalData.addressDetail
      self.setData({
        address: address,
        addressUsername: address.username,
        addressPhone: address.phone,
        addressAddress: address.address,
        mapaddress: address.house,
        gps: {
          longitude: address.longitude,
          latitude: address.latitude,
        }
      })
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
    let self = this
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this
    app.globalData.addressDetail = ''
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

  // 设置名字
  setUsername(e) {
    let self = this
    self.setData({
      addressUsername: e.detail.value
    })
  },

  // 设置手机号
  setPhone(e) {
    let self = this
    self.setData({
      addressPhone: e.detail.value
    })
  },

  // 设置地址类型
  setAddressType(e) {
    let self = this
    let addressType = parseFloat(e.detail.value)
    self.setData({
      addressType: addressType
    })
  },

  // 获取当前位置
  getGps() {
    let self = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      complete() {
        // 打开地图
        self.chooseLocation()
      },
    })
  },

  // 打开地图
  chooseLocation() {
    let self = this
    wx.chooseLocation({
      latitude: self.data.latitude,
      longitude: self.data.longitude,
      success(res) {
        self.setData({
          gps: res,
          mapaddress: res.address + res.name
        })
        // 获取附近自提点
        self.getSiteList()
      }
    })
  },

  // 获取附近自提点
  getSiteList() {
    let self = this
    let data = {
      Latitude: self.data.gps.latitude,
      Longitude: self.data.gps.longitude,
    }
    API.system.getDept(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          siteList: res.data
        })
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置自提点id
  setSiteid(e) {
    let self = this
    let siteid = e.detail.value
    self.setData({
      siteid: siteid
    })
  },

  // 设置详细地址
  setAddressAddress(e) {
    let self = this
    self.setData({
      addressAddress: e.detail.value
    })
  },

  // 保存收货地址
  save() {
    let self = this
    // 验证名字
    if (!self.data.addressUsername) {
      toast('请填写名字')
      return false
    }
    // 验证手机号
    if (!self.data.addressPhone) {
      toast('请填写手机号')
      return false
    }
    // 验证定位
    if (!self.data.mapaddress) {
      toast('请选择收货地址')
      return false
    }
    // 验证详细地址
    if (!self.data.addressAddress) {
      toast('请填写详细地址')
      return false
    }
    let data = {
      addressid: self.data.id,
      Address: self.data.addressAddress,
      Username: self.data.addressUsername,
      Phone: self.data.addressPhone,
      Longitude: self.data.gps.longitude,
      Latitude: self.data.gps.latitude,
      mapaddress: self.data.mapaddress,
      maptype: 'TX',
    }
    API.system.saveAddress(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateBack()
        toast(res.message)
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 收藏自提点
  collectDept() {
    let self = this
    // 验证选择自提点
    if (!self.data.siteid) {
      toast('请选择自提点')
      return false
    }
    let data = {
      flag: 0, // 0:收藏；1：取消
      addressid: self.data.siteid
    }
    API.system.collectDept(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        wx.navigateBack()
        toast(res.message)
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
