/**
 * mem模块接口
 */
import request from '../../utils/request'
import toast from '../../utils/toast'

const appversion = {
  // 关于
  appAbout: data => request('appversion.do?method=appAbout', data),
}

export default appversion
