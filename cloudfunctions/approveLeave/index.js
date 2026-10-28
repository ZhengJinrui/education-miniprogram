const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
exports.main = async (event) => {
  const db = cloud.database(); const wxContext = cloud.getWXContext()
  const teacher = await db.collection('teachers').where({ openid: wxContext.OPENID, active: true }).count()
  if (!teacher.total) throw new Error('无教师审批权限')
  await db.collection('leave_requests').doc(event.requestId).update({ data: { status: event.approved ? 'approved' : 'rejected', teacherId: wxContext.OPENID, reviewedAt: new Date(), comment: event.comment || '' } })
  return { ok: true }
}
