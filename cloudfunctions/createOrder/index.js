const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext(); const db = cloud.database()
  const order = { openid: OPENID, courseId: event.courseId, amount: event.amount, status: 'created', createdAt: new Date() }
  const result = await db.collection('orders').add({ data: order })
  // 这里接入微信支付商户 API，获取 prepay_id 后返回 paySign 等字段。
  return { orderId: result._id, paymentRequired: true, message: '请配置微信支付商户号后生成支付参数' }
}
