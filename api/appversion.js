/**
 * mem模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const appversion = {
  // 关于
  appAbout: data => request.http('appversion.do?method=appAbout', data),
}

export default appversion
