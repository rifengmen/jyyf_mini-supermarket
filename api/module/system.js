/**
 * system模块接口
 */
import request from '../../utils/request'
import toast from '../../utils/toast'

const system = {
  // 获取店铺基础配置
  getTheme: data => request('system/theme.do?method=getTheme', data),
  // 获取友链列表
  getFriendLinks: data => request('system/theme.do?method=getFriendLinks', data),
  // 获取首页弹窗广告图路径
  getHomeAds: data => request('system/theme.do?method=getHomeAds', data),
  // 获取自提点列表
  getDept: data => request('system/theme.do?method=getDept', data),
  // 收藏自提点
  collectDept: data => request('system/theme.do?method=collectDept', data),
  // 签到
  CustomerSign: data => request('system/theme.do?method=CustomerSign', data),
  // 获取图形验证码
  getVerifyCodeGraphic: data => request('system/customlogin.do?method=getVerifyCodeGraphic', data),
  // 获取短信验证码
  getCheckCode180126: data => request('system/customlogin.do?method=getCheckCode180126', data),
  // 注册
  perfectInfoForWX: data => request('system/customlogin.do?method=perfectInfoForWX', data),
  // 获取openid
  getOpenID: data => request('system/customlogin.do?method=getOpenID', data),
  // 登录
  login: data => request('system/customlogin.do?method=login', data),
  // 获取自定义功能列表
  getModulePictureList: data => request('system/customlogin.do?method=getModulePictureList', data),
  // 获取会员卡
  myCard: data => request('system/customlogin.do?method=myCard', data),
  // 修改用户昵称
  modifyname: data => request('system/customlogin.do?method=modifyname', data),
  // 手机号绑定
  bindOpenID: data => request('system/customlogin.do?method=bindOpenID', data),
  // 手机号解除绑定
  unBindOpenID: data => request('system/customlogin.do?method=unBindOpenID', data),
  // 获取门店列表
  listDeptInfo: data => request('system/dept.do?method=listDeptInfo', data),
  // 设置默认门店
  setDefaultFlag: data => request('system/dept.do?method=setDefaultFlag', data),
  // 取消默认门店
  cancelDefaultFlag: data => request('system/dept.do?method=cancelDefaultFlag', data),
  // 获取banner列表
  listShopHomeSlide: data => request('system/slide.do?method=listShopHomeSlide', data),
  // 获取海报列表
  listShopHomeSlide1: data => request('system/slide.do?method=listShopHomeSlide1', data),
  // 获取banner详情
  getLinkForSlide: data => request('system/slide.do?method=getLinkForSlide', data),
  // 获取一级分类
  listClass: data => request('system/goodsclass.do?method=listClass', data),
  // 获取二级分类
  listSubClass: data => request('system/goodsclass.do?method=listSubClass', data),
  // 获取奖项
  getPrizeList: data => request('system/prize.do?method=getPrizeList', data),
  // 请求抽奖结果
  centPrize: data => request('system/prize.do?method=centPrize', data),
  // 获取中奖记录列表
  listPrizeLog: data => request('system/prize.do?method=listPrizeLog', data),
  // 添加投诉建议
  addSuggestion: data => request('system/suggestion.do?method=addSuggestion', data),
  // 获取投诉建议列表
  listSuggestion: data => request('system/suggestion.do?method=listSuggestion', data),
  // 获取投诉建议详情
  listSuggestionDtl: data => request('system/suggestion.do?method=listSuggestionDtl', data),
  // 添加收货地址
  saveAddress: data => request('system/myuser.do?method=saveAddress', data),
  // 删除收货地址
  delAddress: data => request('system/myuser.do?method=delAddress', data),
  // 我的地址列表
  listUserAdress: data => request('system/myuser.do?method=listUserAdress', data),
  // 当前门店可用地址列表
  listUserAdressForDept: data => request('system/myuser.do?method=listUserAdressForDept', data),
  // 获取收货地址
  listAddressInfo: data => request('system/myuser.do?method=listAddressInfo', data),
  // 保存默认地址
  SetDefaultAddress: data => request('system/myuser.do?method=SetDefaultAddress', data),
  // 取消默认地址
  CancelDefaultAddress: data => request('system/myuser.do?method=CancelDefaultAddress', data),
}

export default system
