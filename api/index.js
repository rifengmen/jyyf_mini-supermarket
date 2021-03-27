/**
 * api出口
 */

import system from './module/system'
import info from './module/info'
import bill from './module/bill'
import mem from './module/mem'
import invest from './module/invest'
import appversion from './module/appversion'
import miniLiveInfo from './module/miniLiveInfo'

const api = {
  system,
  info,
  bill,
  mem,
  invest,
  appversion,
  miniLiveInfo,
}

export default api
