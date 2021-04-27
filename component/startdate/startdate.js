// component/startdate/startdate.js
require('../../app.js')
const app = getApp()
import API from '../../api/index'
import util from '../../utils/util'
import toast from '../../utils/toast'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 开始时间
    startdate: '',
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    // 在组件实例刚刚被创建时执行
    created () {

    },
    // 在组件实例进入页面节点树时执行
    attached () {

    },
    // 在组件在视图层布局完成后执行
    ready () {
      let self = this
      // 设置开始时间
      self.setStartdate()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置开始时间
    setStartdate () {
      let self = this
      if (!self.data.startdate) {
        let date = new Date()
        let nowdate = date.getTime()
        let time_length = 30 * 24 * 60 * 60 * 1000
        self.setData({
          startdate: util.formatDate(new Date(nowdate - time_length))
        })
      }
      self.triggerEvent('getList', self.data.startdate)
    },

    // 修改时间
    dateChange (e) {
      let self = this
      let startdate = new Date(e.detail.value)
      self.setData({
        startdate: util.formatDate(new Date(startdate.getTime()))
      })
      // 设置开始时间
      self.setStartdate()
    },
  }
})
