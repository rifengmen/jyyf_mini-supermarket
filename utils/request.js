/**
 * 网络请求相关操作
 */
require("../app.js")

const request = (url, data, method = 'POST') => {
  let app = getApp()
  let ContentType = 'application/x-www-form-urlencoded'
  // get方法设置ContentType类型
  if (method === 'GET') {
    ContentType = 'text/html'
  }
  // 设置请求门店
  let requestData = data
  // 请求直播间列表不增加门店code，deptcode
  if (url !== 'miniLiveInfo.do?method=listLiveInfo') {
    if (!requestData.deptcode) {
      requestData.deptcode = app.globalData.deptcode
    }
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.baseUrl + url,
      method: method,
      data: {'requestData': JSON.stringify(requestData)},
      header: {
        "Content-Type": ContentType,
        "Cookie": app.globalData.sessionId,
      },
      success: function (res) {
        if (res.statusCode !== 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 })
          return false
        }
        if (res.cookies.length) {
          app.globalData.sessionId = res.cookies[0]
        }
        resolve(res)
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 })
        return false
      }
    })
  })
}

export default request
