// component/orderDesc/orderDesc.js
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
    // 订单信详情
    orderDetail: {
      type: Object,
      value: null
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
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
