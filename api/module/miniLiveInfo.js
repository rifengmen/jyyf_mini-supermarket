/**
 * miniLiveInfo模块接口
 */
import request from '../../utils/request'
import toast from '../../utils/toast'

const miniLiveInfo = {
  // 获取房间列表
  listLiveInfo: data => request('miniLiveInfo.do?method=listLiveInfo', data),
}

export default miniLiveInfo
