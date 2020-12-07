/**
 * bill模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const bill = {
  // 加入购物车
  inputIntoCar: data => request.http('bill/shoppingcar.do?method=inputIntoCar', data),
  // 更新购物车数量
  getCarProductCount: data => request.http('bill/shoppingcar.do?method=getCarProductCount', data),
  // 获取购物车列表
  listMyCar: data => request.http('bill/shoppingcar.do?method=listMyCar', data),
  // 修改购物车商品数量的方法
  updateIntoCar: data => request.http('bill/shoppingcar.do?method=updateIntoCar', data),
  // 删除购物车商品的方法
  delCars: data => request.http('bill/shoppingcar.do?method=delCars', data),
  // 获取购物袋列表
  getShoppingBagList: data => request.http('bill/shoppingcar.do?method=getShoppingBagList', data),
  // 购物袋加入购物车
  buyShoppingBag: data => request.http('bill/shoppingcar.do?method=buyShoppingBag', data),
  // 结算
  buyend: data => request.http('bill/shoppingcar.do?method=buyend', data),
  // 可用电子券
  payMoneytick: data => request.http('bill/pay.do?method=payMoneytick', data),
  // 可用积分
  payMoneyjf: data => request.http('bill/pay.do?method=payMoneyjf', data),
  // 获取运费
  getFreight: data => request.http('bill/shoppingcar.do?method=getFreight', data),
  // 取消订单
  CancelSaleOrder: data => request.http('bill/order.do?method=CancelSaleOrder', data),
  // 获取商品评价列表
  getProductEvaluation: data => request.http('bill/evaluation.do?method=getProductEvaluation', data),
  // 添加评价
  addProductEvaluation: data => request.http('bill/evaluation.do?method=addProductEvaluation', data),
  // 获取订单列表
  listMyOrder: data => request.http('bill/order.do?method=listMyOrder', data),
  // 获取订单详情
  listOrderDetails: data => request.http('bill/order.do?method=listOrderDetails', data),
  // 设置支付密码
  cardpayopen: data => request.http('bill/pay.do?method=cardpayopen', data),
  // 重置支付密码
  payPasswordReset: data => request.http('bill/pay.do?method=payPasswordReset', data),
}

export default bill
