// component/startdate/startdate.js
require('../../app.js')
const app = getApp()
const toast = require('../../utils/toast.js')
import API from '../../api/index'

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
        let startdate = new Date(nowdate - time_length).toLocaleString().replace(/:\d{1,2}$/,' ').split(' ')[0]
        self.setData({
          startdate: startdate
        })
      }
      self.triggerEvent('getList', self.data.startdate)
    },

    // 修改时间
    dateChange (e) {
      let self = this
      let startdate = e.detail.value
      self.setData({
        startdate: startdate
      })
      // 设置开始时间
      self.setStartdate()
    },
  }
})
