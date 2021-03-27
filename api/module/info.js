/**
 * info模块接口
 */
import request from '../../utils/request'
import toast from '../../utils/toast'

const info = {
  // 获取推荐商品列表(集群)
  getTheme: data => request('info/Category.do?method=getTheme', data),
  // 获取专区列表
  listHot180414: data => request('info/Category.do?method=listHot180414', data),
  // 获取秒杀商品列表
  getProductListByPromote: data => request('info/goods.do?method=getProductListByPromote', data),
  // 获取自定义(推荐、会员、特价、常购、优选)商品列表
  getProductList: data => request('info/goods.do?method=getProductList', data),
  // 获取单分类/集群商品列表
  getProductListByCate: data => request('info/goods.do?method=getProductListByCate', data),
  // 获取轮播图(分类)商品列表
  getProductListByCateCode: data => request('info/goods.do?method=getProductListByCateCode', data),
  // 获取搜索商品列表
  getProductListByshortcode: data => request('info/goods.do?method=getProductListByshortcode', data),
  // 获取商品码
  getProductBuyCodeUrl: data => request('info/goods.do?method=getProductBuyCodeUrl', data),
  // 获取商品详情页参数
  getUrlParamScene: data => request('info/goods.do?method=getUrlParamScene', data),
  // 获取商品详情
  getProductDetails: data => request('info/goods.do?method=getProductDetails', data),
  // 获取拼团信息
  groupIncrease: data => request('info/goods.do?method=groupIncrease', data),
  // 获取拼团列表
  getGroupList: data => request('info/goods.do?method=getGroupList', data),
  // 获取砍价列表
  getHackList: data => request('info/goods.do?method=getHackList', data),
  // 发起拼团
  groupAdd: data => request('info/goods.do?method=groupAdd ', data),
  // 参团验证
  getGroupInfo: data => request('info/goods.do?method=getGroupInfo ', data),
  // 参与拼团
  groupEnd : data => request('info/goods.do?method=groupEnd ', data),
  // 获取砍价信息
  generateHackBill: data => request('info/goods.do?method=generateHackBill', data),
  // 发起砍价
  hackAdd : data => request('info/goods.do?method=hackAdd ', data),
  // 参与砍价
  hackIncrease : data => request('info/goods.do?method=hackIncrease ', data),
  // 设置常购
  addAlwaysBuyProduct: data => request('info/goods.do?method=addAlwaysBuyProduct', data),
  // 获取消息列表
  listmessage: data => request('info/InformationController.do?method=listmessage', data),
  // 获取消息详情
  listDtl: data => request('info/InformationController.do?method=listDtl', data),
  // 获取公告列表
  listNotice: data => request('info/InformationController.do?method=listNotice', data),
  // 获取公告详情
  listNoticeDtlForWX: data => request('info/InformationController.do?method=listNoticeDtlForWX', data),
  // 获取门店信息
  listdtlForWX: data => request('info/poster.do?method=listdtlForWX', data),
}

export default info
