const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const VERSION = '2026-10-27-random-identity-v2'

function makeRandomIdentity() {
  const prefixes = ['晨光', '星河', '青禾', '向阳', '清风', '逐梦', '知行', '乐学']
  const names = ['小鹿', '海豚', '熊猫', '松鼠', '白兔', '云雀', '小象', '企鹅']
  const emoji = ['🦌', '🐬', '🐼', '🐿️', '🐰', '🐦', '🐘', '🐧']
  const colors = ['#E8B07A', '#7FAFC7', '#91B69E', '#C29A78', '#C8A9C4', '#D7A768', '#8FA6C4', '#7D9D96']
  const i = Math.floor(Math.random() * names.length)
  return {
    realName: `${prefixes[i]}${names[i]}${Math.floor(1000 + Math.random() * 9000)}`,
    avatarEmoji: emoji[i],
    avatarColor: colors[i]
  }
}

exports.main = async (event = {}) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) throw new Error('OPENID_NOT_FOUND')

  const db = cloud.database()
  const ref = db.collection('users').doc(OPENID)
  const randomize = event.randomize === true || event.mode === 'random'
  let data

  if (randomize) {
    data = {
      ...makeRandomIdentity(),
      nickname: '', avatarUrl: '', identityType: 'random',
      realNameSetByUser: false, profileCompleted: true,
      updatedAt: new Date(), profileVersion: VERSION
    }
  } else {
    const realName = String(event.realName || '').trim().slice(0, 20)
    const avatarUrl = String(event.avatarUrl || '')
    if (!/^[\u4e00-\u9fa5A-Za-z0-9\u00b7_-]{2,20}$/.test(realName)) throw new Error('INVALID_DISPLAY_NAME')
    if (avatarUrl && !avatarUrl.startsWith('cloud://')) throw new Error('INVALID_AVATAR_URL')
    data = {
      realName, nickname: '', identityType: 'custom',
      realNameSetByUser: true, profileCompleted: true,
      updatedAt: new Date(), profileVersion: VERSION
    }
    if (event.clearAvatar === true) Object.assign(data, { avatarUrl: '', avatarEmoji: '', avatarColor: '' })
    else if (avatarUrl) Object.assign(data, { avatarUrl, avatarEmoji: '', avatarColor: '' })
  }

  try { await ref.update({ data }) }
  catch (_) { await ref.set({ data: { openid: OPENID, role: 'student', points: 0, createdAt: new Date(), ...data } }) }

  const user = (await ref.get()).data
  return { ok: true, version: VERSION, mode: randomize ? 'random' : 'custom', user }
}
