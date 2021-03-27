// component/scanDialog/scanDialog.js
require('../../app.js')
const app = getApp()
import toast from '../../utils/toast'
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
    goodsInfo: {
      type: Object,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 手指触摸后移动(阻止冒泡)
    catchTouchMove (res) {
      return false
    },

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
