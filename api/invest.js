/**
 * invest模块接口
 */
const request = require("../utils/request")
const toast = require("../utils/toast")

const invest = {
  // 获取门店列表
  listDeptInfo: data => request.http('invest/microFlow.do?method=listDeptInfo', data),
  // 获取商品信息
  getProductDetailsByBarcode: data => request.http('invest/microFlow.do?method=getProductDetailsByBarcode', data),
  // 保存订单
  saveFlow: data => request.http('invest/microFlow.do?method=saveFlow', data),
  // 取消订单
  cancelSaleOrder: data => request.http('invest/microFlow.do?method=cancelSaleOrder', data),
  // 获取订单列表
  listMicroFlow: data => request.http('invest/microFlow.do?method=listMicroFlow', data),
  // 获取订单详情
  listMicroFlowDtl: data => request.http('invest/microFlow.do?method=listMicroFlowDtl', data),
  // 获取支付方式列表
  getMicroFlowPayMoney: data => request.http('invest/microFlow.do?method=getMicroFlowPayMoney', data),
  // 立即支付
  microFlowToPay: data => request.http('invest/microFlow.do?method=microFlowToPay', data),
  // 获取出场码
  getFlowno: data => request.http('invest/microFlow.do?method=getFlowno', data),
}

export default invest
