// component/countdown/countdown.js
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
    // 时间点
    times: {
      type: String,
      value: ''
    },
    // type，时间点类型，0：距开始时间点；1：距结束时间点
    type: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 剩余时长
    time: 1,
    // 天
    days: '00',
    // 小时
    hours: '00',
    // 分钟
    minutes: '00',
    // 秒
    second: '00'
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
      // 初始化定时器
      self.initTimes()
    },
    // 在组件实例被从页面节点树移除时执行
    detached: function() {
      let self = this
      // 关闭定时器
      self.closeTimes()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化定时器
    initTimes () {
      let self = this
      self.countdown = setInterval(() => {
        // 格式化时间
        self.timeTodate()
      }, 1000)
    },

    // 格式化时间
    timeTodate () {
      let self = this
      let times = self.data.times
      times = times.replace(/-/g, '/')
      let nowtimes = new Date(times).getTime()
      self.setData({
        time: (nowtimes - new Date().getTime()) / 1000
      })
      // 倒计时进行
      if (self.data.time !== null && self.data.time !== '' && self.data.time > 0) {
        let d = parseInt(self.data.time / (60 * 60 * 24))
        let h = parseInt(self.data.time / (60 * 60) % 24)
        let m = parseInt(self.data.time / 60 % 60)
        let s = parseInt(self.data.time % 60)
        self.setData({
          days: self.checkTime(d),
          hours: self.checkTime(h),
          minutes: self.checkTime(m),
          second: self.checkTime(s),
        })
        // console.log(self.hours + 'H' + self.minutes + 'M' + self.second + 'S')
      } else if (self.data.time <= 0) { // 倒计时结束
        // 关闭定时器
        self.closeTimes()
        // 触发父组件结束商品活动
        self.triggerEvent('setFlag')
        // if (self.data.type) {
        //   // 触发父组件结束商品活动
        //   self.triggerEvent('setFlag')
        // } else {
        //   // 触发父组件结束商品活动
        //   self.triggerEvent('setFlag')
        // }
      }
    },

    // 一位时间加零
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },

    // 关闭定时器
    closeTimes () {
      let self = this
      // 关闭定时器
      clearInterval(self.countdown)
    },
  }
})
