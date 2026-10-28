const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext(); const db = cloud.database()
  const data = { studentId: OPENID, courseId: event.courseId, date: event.date, reason: event.reason, status: 'pending', createdAt: new Date() }
  const result = await db.collection('leave_requests').add({ data }); return { id: result._id, status: data.status }
}
