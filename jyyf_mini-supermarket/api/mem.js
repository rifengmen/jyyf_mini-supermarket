/**
 * mem模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const mem = {
  // 获取购买商品列表
  listMemberConsumGdscode: data => request.http('mem/member.do?method=listMemberConsumGdscode', data),
  // 获取积分详情
  listScoreDtl: data => request.http('mem/card.do?method=listScoreDtl', data),
  // 获取卡余额
  getMyCardInfo: data => request.http('mem/card.do?method=getMyCardInfo', data),
  // 获取付款码
  createPayMoneyStr180414: data => request.http('mem/member.do?method=createPayMoneyStr180414', data),
  // 获取余额详情
  listMoneyCardDtl: data => request.http('mem/card.do?method=listMoneyCardDtl', data),
  // 发送充值信息
  reChargeToPay: data => request.http('mem/member.do?method=reChargeToPay', data),
  // 充值支付
  reChargePay: data => request.http('mem/member.do?method=reChargePay', data),
  // 领券中心
  listCouponForGet: data => request.http('mem/member.do?method=listCouponForGet', data),
  // 获取电子券详情
  getCouponDtl: data => request.http('mem/member.do?method=getCouponDtl', data),
  // 领取电子券
  panicCoupon: data => request.http('mem/member.do?method=panicCoupon', data),
  // 使用电子券
  payTicketCheck: data => request.http('mem/member.do?method=payTicketCheck', data),
  // 我的电子券
  listCoupon: data => request.http('mem/member.do?method=listCoupon', data),
  // 获取消费列表
  listMemberConsum: data => request.http('mem/member.do?method=listMemberConsum', data),
  // 获取消费详情
  listDetails: data => request.http('mem/member.do?method=listDetails', data),
  // 立即支付
  ordercommit: data => request.http('mem/member.do?method=ordercommit', data),
}

export default mem
