const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
exports.main = async () => {
  const { OPENID } = cloud.getWXContext(); const db = cloud.database(); const ref = db.collection('users').doc(OPENID); const now = new Date(); let user
  try {
    const old = await ref.get(); user = { ...old.data, updatedAt: now }
    // Only the profile form sets this marker; legacy nickname-derived names must be re-entered.
    user.realNameSetByUser = Boolean(user.realNameSetByUser && /^[\u4e00-\u9fa5·]{2,20}$/.test(String(user.realName || '').trim()))
    user.profileCompleted = user.realNameSetByUser
    await ref.update({ data: { updatedAt: now, profileCompleted: user.profileCompleted } })
  } catch (_) {
    user = { openid: OPENID, role: 'student', nickname: '', realName: '', realNameSetByUser: false, avatarUrl: '', profileCompleted: false, points: 0, createdAt: now, updatedAt: now }
    await ref.set({ data: user })
  }
  return { openid: OPENID, user }
}
