// component/dialog/dialog.js
require('../../app.js')
const app = getApp()
const toast = require('../../utils/toast.js')
import API from '../../api/index'

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
    // 商品信息
    goods: {
      type: Object,
      value: null
    },
    // 弹窗斤
    dialogJin: {
      type: String,
      value: ''
    },
    // 弹窗两
    dialogLiang: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 弹框组件显示开关
    dialogFlag: false,
    // 弹窗重量
    dialogCount: '',
    // 弹窗合计金额
    dialogTotalMoney: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 弹窗取消
    dialogClose () {
      let self = this
      self.setData({
        dialogFlag: false,
        dialogJin: '',
        dialogLiang: '',
        dialogCount: '',
        dialogTotalMoney: '',
        goods: '',
      })
      self.triggerEvent('dialogClose')
    },

    // 弹窗确认
    dialogConfirm () {
      let self = this
      let goods = self.data.goods
      goods.count = self.data.dialogCount
      self.triggerEvent('dialogConfirm', goods)
    },

    // 设置弹窗斤
    setDialogJin (e) {
      let self = this
      self.setData({
        dialogJin: e.detail.value
      })
      // 设置弹窗重量
      self.setDialogCount()
      // 设置弹窗金额
      self.setDialogTotalMoney()
    },

    // 设置弹窗两
    setDialogLiang (e) {
      let self = this
      self.setData({
        dialogLiang: e.detail.value
      })
      // 设置弹窗重量
      self.setDialogCount()
      // 设置弹窗金额
      self.setDialogTotalMoney()
    },

    // 设置弹窗重量
    setDialogCount () {
      let self = this
      self.setData({
        dialogCount: (self.data.dialogJin/2 + self.data.dialogLiang/20).toFixed(2)
      })
    },

    // 设置弹窗金额
    setDialogTotalMoney () {
      let self = this
      self.setData({
        dialogTotalMoney: (self.data.goods.Highpprice * self.data.dialogCount).toFixed(2)
      })
    },
  }
})
