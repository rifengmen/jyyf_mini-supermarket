/**
 * miniLiveInfo模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const miniLiveInfo = {
  // 获取房间列表
  listLiveInfo: data => request.http('miniLiveInfo.do?method=listLiveInfo', data),
}

export default miniLiveInfo
