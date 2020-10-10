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
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        if (month - 1 <= 0) {
          year = year - 1;
          month = month - 1 + 12;
        } else {
          month = month - 1;
        }
        // let startdate = year + '/' + month + '/' + day + ' ' + '00:0:00'
        let startdate = year + '/' + month + '/' + day
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
