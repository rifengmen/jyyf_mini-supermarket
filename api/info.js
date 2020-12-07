/**
 * info模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const info = {
  // 获取推荐商品列表(集群)
  getTheme: data => request.http('info/Category.do?method=getTheme', data),
  // 获取专区列表
  listHot180414: data => request.http('info/Category.do?method=listHot180414', data),
  // 获取秒杀商品列表
  getProductListByPromote: data => request.http('info/goods.do?method=getProductListByPromote', data),
  // 获取自定义(推荐、会员、特价、常购、优选)商品列表
  getProductList: data => request.http('info/goods.do?method=getProductList', data),
  // 获取单分类/集群商品列表
  getProductListByCate: data => request.http('info/goods.do?method=getProductListByCate', data),
  // 获取轮播图(分类)商品列表
  getProductListByCateCode: data => request.http('info/goods.do?method=getProductListByCateCode', data),
  // 获取搜索商品列表
  getProductListByshortcode: data => request.http('info/goods.do?method=getProductListByshortcode', data),
  // 获取商品详情
  getProductDetails: data => request.http('info/goods.do?method=getProductDetails', data),
  // 设置常购
  addAlwaysBuyProduct: data => request.http('info/goods.do?method=addAlwaysBuyProduct', data),
  // 获取消息列表
  listmessage: data => request.http('info/InformationController.do?method=listmessage', data),
  // 获取消息详情
  listDtl: data => request.http('info/InformationController.do?method=listDtl', data),
  // 获取公告列表
  listNotice: data => request.http('info/InformationController.do?method=listNotice', data),
  // 获取公告详情
  listNoticeDtlForWX: data => request.http('info/InformationController.do?method=listNoticeDtlForWX', data),
  // 获取门店信息
  listdtlForWX: data => request.http('info/poster.do?method=listdtlForWX', data),
}

export default info
