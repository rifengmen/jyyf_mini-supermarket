// component/scanDialog/scanDialog.js
require('../../app.js')
const app = getApp()
const request = require('../../utils/request.js')
const toast = require('../../utils/toast.js')

Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: {
      type: Object,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 扫码购类型，0：共用线上购物车；1：本地独立购物车
    scanType: app.globalData.scanType,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // confirm确认
    confirm () {
      let self = this
      self.triggerEvent('addScancart')
    },

    // cancel取消
    cancel () {
      let self = this
      self.triggerEvent('cancel')
    },

    // 加入返回
    addBack () {
      let self = this
      self.triggerEvent('addBack')
    },

    // 加入继续
    addGoOn () {
      let self = this
      self.triggerEvent('addGoOn')
    },
  }
})
