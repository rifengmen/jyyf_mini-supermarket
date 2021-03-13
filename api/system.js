/**
 * system模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const system = {
  // 获取店铺基础配置
  getTheme: data => request.http('system/theme.do?method=getTheme', data),
  // 获取友链列表
  getFriendLinks: data => request.http('system/theme.do?method=getFriendLinks', data),
  // 获取自提点列表
  getDept: data => request.http('system/theme.do?method=getDept', data),
  // 收藏自提点
  collectDept: data => request.http('system/theme.do?method=collectDept', data),
  // 获取图形验证码
  getVerifyCodeGraphic: data => request.http('system/customlogin.do?method=getVerifyCodeGraphic', data),
  // 获取短信验证码
  getCheckCode180126: data => request.http('system/customlogin.do?method=getCheckCode180126', data),
  // 注册
  perfectInfoForWX: data => request.http('system/customlogin.do?method=perfectInfoForWX', data),
  // 获取openid
  getOpenID: data => request.http('system/customlogin.do?method=getOpenID', data),
  // 登录
  login: data => request.http('system/customlogin.do?method=login', data),
  // 获取自定义功能列表
  getModulePictureList: data => request.http('system/customlogin.do?method=getModulePictureList', data),
  // 获取会员卡
  myCard: data => request.http('system/customlogin.do?method=myCard', data),
  // 修改用户昵称
  modifyname: data => request.http('system/customlogin.do?method=modifyname', data),
  // 手机号解除绑定
  unBindOpenID: data => request.http('system/customlogin.do?method=unBindOpenID', data),
  // 获取门店列表
  listDeptInfo: data => request.http('system/dept.do?method=listDeptInfo', data),
  // 设置默认门店
  setDefaultFlag: data => request.http('system/dept.do?method=setDefaultFlag', data),
  // 取消默认门店
  cancelDefaultFlag: data => request.http('system/dept.do?method=cancelDefaultFlag', data),
  // 获取banner列表
  listShopHomeSlide: data => request.http('system/slide.do?method=listShopHomeSlide', data),
  // 获取海报列表
  listShopHomeSlide1: data => request.http('system/slide.do?method=listShopHomeSlide1', data),
  // 获取banner详情
  getLinkForSlide: data => request.http('system/slide.do?method=getLinkForSlide', data),
  // 获取一级分类
  listClass: data => request.http('system/goodsclass.do?method=listClass', data),
  // 获取二级分类
  listSubClass: data => request.http('system/goodsclass.do?method=listSubClass', data),
  // 获取奖项
  getPrizeList: data => request.http('system/prize.do?method=getPrizeList', data),
  // 请求抽奖结果
  centPrize: data => request.http('system/prize.do?method=centPrize', data),
  // 获取中奖记录列表
  listPrizeLog: data => request.http('system/prize.do?method=listPrizeLog', data),
  // 添加投诉建议
  addSuggestion: data => request.http('system/suggestion.do?method=addSuggestion', data),
  // 获取投诉建议列表
  listSuggestion: data => request.http('system/suggestion.do?method=listSuggestion', data),
  // 获取投诉建议详情
  listSuggestionDtl: data => request.http('system/suggestion.do?method=listSuggestionDtl', data),
  // 添加收货地址
  saveAddress: data => request.http('system/myuser.do?method=saveAddress', data),
  // 删除收货地址
  delAddress: data => request.http('system/myuser.do?method=delAddress', data),
  // 我的地址列表
  listUserAdress: data => request.http('system/myuser.do?method=listUserAdress', data),
  // 当前门店可用地址列表
  listUserAdressForDept: data => request.http('system/myuser.do?method=listUserAdressForDept', data),
  // 获取收货地址
  listAddressInfo: data => request.http('system/myuser.do?method=listAddressInfo', data),
  // 保存默认地址
  SetDefaultAddress: data => request.http('system/myuser.do?method=SetDefaultAddress', data),
  // 取消默认地址
  CancelDefaultAddress: data => request.http('system/myuser.do?method=CancelDefaultAddress', data),
}

export default system
