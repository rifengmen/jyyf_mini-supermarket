// component/scanDialog/scanDialog.js
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
  }
})
