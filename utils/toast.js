/**
 *
 * 提示消息相关操作
 */
require("../app.js")

const toast = (message, url, duration = 4000, closetime = 5000) => {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: duration
  })
  setTimeout(function () {
    wx.hideToast()
    if (url === 'userInfo') {
      wx.switchTab({
        url: '/pages/userInfo/userInfo',
      })
    } else if (url === 'index') {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (url === 'back') {
      wx.navigateBack()
    }
  }, closetime)
}

module.exports = {
  toast: toast
}
