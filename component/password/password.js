// component/password/password.js
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

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 支付密码
    password: '',
    // 密码
    pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
    // focusFlag input框获取焦点开关
    focusFlag: true,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 手指触摸后移动(阻止冒泡)
    catchTouchMove (res) {
      return false
    },

    // input框获取焦点
    focusInput () {
      let self = this
      self.setData({
        focusFlag: !self.data.focusFlag,
      })
    },

    // 设置密码
    setPassword (e) {
      let self = this
      let _password = e.detail.value
      self.setData({
        password: _password,
      })
      _password = _password.split('')
      if (_password.length) {
        let pd = self.data.pd
        for (let i = 0; i < 6; i++) {
          if (_password[i]) {
            pd[i].password = '*'
            self.setData({
              pd: pd
            })
          } else {
            pd[i].password = ''
            self.setData({
              pd: pd
            })
          }
        }
      } else {
        self.setData({
          pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
        })
      }
    },

    // 密码框确认
    confirmBtn () {
      let self = this
      let password = self.data.password
      if (password.length < 6) {
        toast.toast('请输入支付密码')
        return false
      }
      // 触发父组件方法
      self.triggerEvent('getPassword', password)
    },

    // 取消密码弹框
    cancelBtn () {
      let self = this
      self.setData({
        password: '',
        pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''}, {password: ''},],
      })
      // 触发父组件方法
      self.triggerEvent('setPasswordFlag')
    },
  }
})
