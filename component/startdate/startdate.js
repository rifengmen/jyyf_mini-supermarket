// component/startdate/startdate.js
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
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show: function() {
      let self = this
      // 设置开始时间
      self.setStartdate()
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
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
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        if (month - 1 <= 0) {
          year = year - 1;
          month = month - 1 + 12;
        } else {
          month = month - 1;
        }
        let startdate = year + '/' + month + '/' + day + ' ' + '00:0:00'
        self.setData({
          startdate: startdate
        })
      }
      self.triggerEvent('getList', self.data.startdate)
    },

    // 修改时间
    dateChange (e) {
      let self = this
      self.setData({
        startdate: e.detail.value
      })
      // 设置开始时间
      self.setStartdate()
    },
  }
})
