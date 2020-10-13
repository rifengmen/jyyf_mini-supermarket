/**
 *
 * 网络请求相关操作
 */
require("../app.js")

const http = (url, data, method = 'POST') => {
  let app = getApp()
  let globalData = app.globalData
  let ContentType = 'application/x-www-form-urlencoded'
  if (method === 'GET') {
    ContentType = 'text/html'
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${globalData.baseUrl}${url}`,
      method: method,
      data: {'requestData': JSON.stringify(data)},
      header: {
        "Content-Type": ContentType,
        "Cookie": globalData.sessionId,
      },
      success: function (res) {
        if (res.statusCode !== 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 })
          return
        }
        resolve(res)
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 })
        return
      }
    })
  })
}

module.exports = {
  http: http
}
