// pages/userInfo/editorAddress/editorAddress.js
const app = getApp()
const request = require("../../../utils/request")
const toast = require("../../../utils/toast")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址id
    id: '',
    // 来自哪儿
    from: '',
    // 地址详情
    address: '',
    // 区域
    listOneArea: [
      {areaname: '请选择区域',}
    ],
    // 选中区域下标
    listOneAreaIndex: 0,
    // 街道
    listSubArea: [
      {areaname: '请选择街道',}
    ],
    // 选中街道下标
    listSubAreaIndex: 0,
    // 名字
    addressUsername: '',
    // 手机号
    addressPhone: '',
    // 街道
    addressAreaid: '',
    // 详细地址
    addressAddress: '',
    // 默认地址
    addressIsdefault: 0,
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
        addressAreaid: address.areaid,
        addressAddress: address.address,
        addressIsdefault: address.isdefault,
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
    // 获取区域
    self.getListOneArea()
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
  onShareAppMessage: function () {

  },

  // 获取区域
  getListOneArea () {
    let self = this
    let address = self.data.address
    let data = {}
    request.http('front/area.do?method=listOneArea', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let listOneArea = self.data.listOneArea
        listOneArea.push(...res.data)
        self.setData({
          listOneArea: listOneArea,
        })
        if (address) {
          let _index
          listOneArea.forEach((item, index) => {
            if (item.areaid === address.parentAreaid) {
              _index = index
            }
          })
          self.setData({
            listOneAreaIndex: _index,
          })
          // 获取街道
          self.getListSubArea(address.parentAreaid)
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 获取街道
  getListSubArea (areaid) {
    let self = this
    let address = self.data.address
    let data = {
      areaid: areaid,
    }
    request.http('front/area.do?method=listSubArea', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        let listSubArea = self.data.listSubArea
        listSubArea.push(...res.data)
        self.setData({
          listSubArea: listSubArea
        })
        if (address) {
          let _index
          listSubArea.forEach((item, index) => {
            if (item.areaid === address.areaid) {
              _index = index
            }
          })
          self.setData({
            listSubAreaIndex: _index,
          })
        }
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 设置名字
  setUsername (e) {
    let self = this
    self.setData({
      addressUsername: e.detail.value
    })
  },

  // 设置手机号
  setPhone (e) {
    let self = this
    self.setData({
      addressPhone: e.detail.value
    })
  },

  // 区域变更
  listOneAreaChange (e) {
    let self = this
    let listOneArea = self.data.listOneArea
    let listOneAreaIndex = e.detail.value
    let areaid = listOneArea[listOneAreaIndex].areaid
    self.setData({
      listOneAreaIndex: listOneAreaIndex,
    })
    // 获取街道
    self.getListSubArea(areaid)
  },

  // 街道变更
  listSubAreaChange (e) {
    let self = this
    let listSubArea = self.data.listSubArea
    let listSubAreaIndex = e.detail.value
    let areaid = listSubArea[listSubAreaIndex].areaid
    self.setData({
      listSubAreaIndex: listSubAreaIndex,
      addressAreaid: areaid,
    })
  },

  // 设置详细地址
  setAddressAddress (e) {
    let self = this
    self.setData({
      addressAddress: e.detail.value
    })
  },

  // 设置/取消默认地址
  setIsdefault (e) {
    let self = this
    let isdefault = e.detail.value
    if (isdefault) {
      self.setData({
        addressIsdefault: 1,
      })
    } else {
      self.setData({
        addressIsdefault: 0,
      })
    }
  },

  // 保存
  save () {
    let self = this
    // 验证名字
    if (!self.data.addressUsername) {
      toast.toast('请填写名字')
      return false
    }
    // 验证手机号
    if (!self.data.addressPhone) {
      toast.toast('请填写手机号')
      return false
    }
    // 验证区域
    if (!self.data.listOneAreaIndex) {
      toast.toast('请选择区域')
      return false
    }
    // 验证街道
    if (!self.data.listSubAreaIndex) {
      toast.toast('请选择街道')
      return false
    }
    // 验证详细地址
    if (!self.data.addressAddress) {
      toast.toast('请填写详细地址')
      return false
    }
    let data = {
      addressid: self.data.id,
      areaid: self.data.addressAreaid,
      Address: self.data.addressAddress,
      Username: self.data.addressUsername,
      Phone: self.data.addressPhone,
    }
    request.http('system/myuser.do?method=saveAddress', data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        toast.toast(res.message)
        wx.navigateBack()
      } else {
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 删除
  delete () {
    let self = this
    let data = {
      Id: self.data.id
    }
    // 确认弹窗
    wx.showModal({
     title: '提示',
     content: '您确定要删除这个地址吗？',
     success (res) {
       // 确认按钮执行
       if (res.confirm) {
         request.http('system/myuser.do?method=delAddress', data).then(result => {
            let res = result.data
            if (res.flag === 1) {
              wx.navigateBack()
            } else {
              toast.toast(res.message)
            }
         }).catch(error => {
           toast.toast(error.error)
         })
       }
     }
    })
  },
})
