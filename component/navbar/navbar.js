// component/navbar/navbar.js
require('../../app.js')
const app = getApp()

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
    // homebgcolor
    homebgcolor: {
      type: String,
      value: '255, 255, 255'
    },
    // 页面名称
    pagename: {
      type: String,
      value: ''
    },
    //判断是否显示左上角的按钮    
    shownav: {
      type: Boolean,
      value: true
    },
    // 判断是否显示左上角搜索
    showsearch: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // apptitle
    apptitle: app.globalData.apptitle,
    //导航栏高度
    navHeight: app.globalData.navHeight,
    //胶囊按钮与顶部的距离
    navTop: app.globalData.navTop,
    //胶囊高度
    jnheight: app.globalData.jnheight,
    //胶囊宽度
    jnwidth: app.globalData.jnwidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      wx.navigateBack()
    },

    //回主页
    navHome: function () {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
  }
})
