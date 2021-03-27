/**
 * bill模块接口
 */
import request from '../../utils/request'
import toast from '../../utils/toast'

const bill = {
  // 加入购物车
  inputIntoCar: data => request('bill/shoppingcar.do?method=inputIntoCar', data),
  // 更新购物车数量
  getCarProductCount: data => request('bill/shoppingcar.do?method=getCarProductCount', data),
  // 获取购物车列表
  listMyCar: data => request('bill/shoppingcar.do?method=listMyCar', data),
  // 修改购物车商品数量的方法
  updateIntoCar: data => request('bill/shoppingcar.do?method=updateIntoCar', data),
  // 删除购物车商品的方法
  delCars: data => request('bill/shoppingcar.do?method=delCars', data),
  // 获取购物袋列表
  getShoppingBagList: data => request('bill/shoppingcar.do?method=getShoppingBagList', data),
  // 购物袋加入购物车
  buyShoppingBag: data => request('bill/shoppingcar.do?method=buyShoppingBag', data),
  // 结算
  buyend: data => request('bill/shoppingcar.do?method=buyend', data),
  // 获取运费
  getFreight: data => request('bill/shoppingcar.do?method=getFreight', data),
  // 设置支付密码
  cardpayopen: data => request('bill/pay.do?method=cardpayopen', data),
  // 重置支付密码
  payPasswordReset: data => request('bill/pay.do?method=payPasswordReset', data),
  // 可用电子券
  payMoneytick: data => request('bill/pay.do?method=payMoneytick', data),
  // 可用积分
  payMoneyjf: data => request('bill/pay.do?method=payMoneyjf', data),
  // 获取订单列表
  listMyOrder: data => request('bill/order.do?method=listMyOrder', data),
  // 获取订单详情
  listOrderDetails: data => request('bill/order.do?method=listOrderDetails', data),
  // 变更订单状态
  pickOrder: data => request('bill/order.do?method=pickOrder', data),
  // 取消订单
  CancelSaleOrder: data => request('bill/order.do?method=CancelSaleOrder', data),
  // 获取订单数量（内部功能用）
  getOrderNum: data => request('bill/order.do?method=getOrderNum', data),
  // 获取商品评价列表
  getProductEvaluation: data => request('bill/evaluation.do?method=getProductEvaluation', data),
  // 添加评价
  addProductEvaluation: data => request('bill/evaluation.do?method=addProductEvaluation', data),
}

export default bill
