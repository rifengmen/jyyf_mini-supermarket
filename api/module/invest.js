/**
 * invest模块接口
 */
import request from '../../utils/request'
import toast from '../../utils/toast'

const invest = {
  // 获取门店列表
  listDeptInfo: data => request('invest/microFlow.do?method=listDeptInfo', data),
  // 获取商品信息
  getProductDetailsByBarcode: data => request('invest/microFlow.do?method=getProductDetailsByBarcode', data),
  // 保存订单
  saveFlow: data => request('invest/microFlow.do?method=saveFlow', data),
  // 取消订单
  cancelSaleOrder: data => request('invest/microFlow.do?method=cancelSaleOrder', data),
  // 获取订单列表
  listMicroFlow: data => request('invest/microFlow.do?method=listMicroFlow', data),
  // 获取订单详情
  listMicroFlowDtl: data => request('invest/microFlow.do?method=listMicroFlowDtl', data),
  // 获取支付方式列表
  getMicroFlowPayMoney: data => request('invest/microFlow.do?method=getMicroFlowPayMoney', data),
  // 立即支付
  microFlowToPay: data => request('invest/microFlow.do?method=microFlowToPay', data),
  // 获取出场码
  getFlowno: data => request('invest/microFlow.do?method=getFlowno', data),
}

export default invest
