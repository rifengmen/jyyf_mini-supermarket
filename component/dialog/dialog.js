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
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 商品数量/重量
    dialogCount: 0,
    // 合计金额
    dialogTotalMoney: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 手指触摸后移动(阻止冒泡)
    catchTouchMove (res) {
      return false
    },

    // 弹窗取消
    dialogClose () {
      let self = this
      self.setData({
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
      goods.amount = self.data.dialogCount
      self.triggerEvent('dialogConfirm', goods)
    },

    // 设置斤
    setDialogJin (e) {
      let self = this
      self.setData({
        dialogJin: e.detail.value
      })
      // 设置弹窗重量
      self.setDialogCount()
    },

    // 设置两
    setDialogLiang (e) {
      let self = this
      self.setData({
        dialogLiang: e.detail.value
      })
      // 设置弹窗重量
      self.setDialogCount()
    },

    // 弹窗数量加
    addCart() {
      let self = this
      let dialogCount = self.data.dialogCount
      dialogCount++
      let e = {
        detail: {
          value: dialogCount
        }
      }
      // 设置商品数量/重量
      self.setDialogCount(e)
    },

    // 弹窗数量减
    subtrackCart() {
      let self = this
      let dialogCount = self.data.dialogCount
      if (dialogCount <= 1) {
        return false
      }
      dialogCount--
      let e = {
        detail: {
          value: dialogCount
        }
      }
      // 设置商品数量/重量
      self.setDialogCount(e)
    },

    // 设置商品数量/重量
    setDialogCount (e) {
      let self = this
      let dialogCount = ''
      if (self.data.goods.scaleflag) {
        dialogCount = (self.data.dialogJin/2 + self.data.dialogLiang/20).toFixed(2)
      } else {
        dialogCount = e.detail.value
      }
      // 判断单人限量
      if (self.data.goods.perlimit && (dialogCount > self.data.goods.perlimit)) {
        toast.toast('已达最大限购量!')
        return false
      }
      self.setData({
        dialogCount: dialogCount
      })
      // 设置合计金额
      self.setDialogTotalMoney()
    },

    // 设置合计金额
    setDialogTotalMoney () {
      let self = this
      let goods = self.data.goods
      self.setData({
        dialogTotalMoney: (goods.Highpprice * self.data.dialogCount).toFixed(2)
      })
    },
  },

  /**
   * 组件的属性监听器
   */
  observers: {
    'goods': function(field) {
      let self = this
      if (field) {
        if (!field.scaleflag) {
          self.setData({
            dialogCount: 1
          })
        }
        // 设置合计金额
        self.setDialogTotalMoney()
      }
    },
  },
})
