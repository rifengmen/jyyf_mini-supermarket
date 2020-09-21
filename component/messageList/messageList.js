// component/messageList/messageList.js
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
    messageList: {
      type: Object,
      value: null,
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

  }
})
