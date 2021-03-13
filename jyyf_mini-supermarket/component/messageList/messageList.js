// component/messageList/messageList.js
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
    // 信息列表
    messageList: {
      type: Object,
      value: null,
    },
    // 信息种类
    type: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 数据列表
    list: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去详情页
    toDetail (e) {
      let self = this
      let detail = e.currentTarget.dataset.detail
      if (self.data.type) {
        self.triggerEvent('setList', detail.id)
        wx.navigateTo({
          url: '/message/pages/detail/detail?id=' + detail.id + '&type=' + self.data.type
        })
      }
    },
  }
})
