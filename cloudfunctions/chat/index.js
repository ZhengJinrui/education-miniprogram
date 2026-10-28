const cloud = require('wx-server-sdk')
const https = require('https')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const DEFAULT_SETTINGS = {
  assistantName: '小启',
  tone: '耐心、鼓励、清晰，适合中小学生理解',
  systemPrompt: '你是启晨教育的学习助手。你主要解答英语和小学数学问题。讲解应循序渐进，优先提示思路，不直接替学生完成作业。遇到不确定的信息要明确说明。不要索取身份证号、住址、电话、银行卡等敏感信息。',
  faqs: [
    { question: '怎么请假', answer: '请在首页“我的课表”中点击“请假申请”，选择课程和日期，填写原因后提交给任课老师审批。' },
    { question: '积分怎么获得', answer: '完成同步学练并取得满分即可获得积分，积分可以在“我的—积分兑换”中兑换礼物。' },
    { question: '怎么查看课表', answer: '首页“我的课表”会显示上课时间、教室和任课老师。' }
  ]
}

function postJson(url, headers, body) {
  return new Promise((resolve, reject) => {
    const target = new URL(url)
    const req = https.request({ hostname: target.hostname, path: target.pathname, method: 'POST', headers, timeout: 50000 }, res => {
      let raw = ''
      res.setEncoding('utf8')
      res.on('data', chunk => { raw += chunk })
      res.on('end', () => {
        let data
        try { data = JSON.parse(raw) } catch (_) { return reject(new Error(`DeepSeek 返回了无法解析的内容（HTTP ${res.statusCode}）`)) }
        if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error(data.error?.message || `DeepSeek 请求失败（HTTP ${res.statusCode}）`))
        resolve(data)
      })
    })
    req.on('timeout', () => req.destroy(new Error('DeepSeek 响应超时，请稍后再试')))
    req.on('error', reject)
    req.write(JSON.stringify(body)); req.end()
  })
}

function cleanMessages(messages) {
  return (Array.isArray(messages) ? messages : []).slice(-12).map(item => ({
    role: item.role === 'assistant' || item.role === 'ai' ? 'assistant' : 'user',
    content: String(item.content || item.text || '').trim().slice(0, 2000)
  })).filter(item => item.content)
}

exports.main = async event => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) throw new Error('请登录后使用智能助手')
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('云函数尚未配置 DEEPSEEK_API_KEY')
  const db = cloud.database()
  let settings = DEFAULT_SETTINGS
  try {
    const result = await db.collection('ai_settings').doc('default').get()
    settings = { ...DEFAULT_SETTINGS, ...result.data }
  } catch (_) {}

  const history = cleanMessages(event.messages)
  const lastQuestion = history.filter(item => item.role === 'user').pop()?.content || String(event.prompt || '').trim().slice(0, 2000)
  if (!lastQuestion) throw new Error('请输入问题')
  const faq = (settings.faqs || []).find(item => lastQuestion.includes(item.question))
  let answer, usage = null
  if (faq) {
    answer = faq.answer
  } else {
    const system = `${settings.systemPrompt}\n你的名字是${settings.assistantName}。回答语气：${settings.tone}。回答尽量控制在500字以内。`
    const data = await postJson('https://api.deepseek.com/chat/completions', {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    }, {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-flash',
      messages: [{ role: 'system', content: system }, ...(history.length ? history : [{ role: 'user', content: lastQuestion }])],
      stream: false,
      max_tokens: 800,
      temperature: 0.5,
      user_id: crypto.createHash('sha256').update(OPENID).digest('hex').slice(0, 32)
    })
    answer = data.choices?.[0]?.message?.content || '暂时没有生成有效回答，请换一种问法。'
    usage = data.usage || null
  }

  await db.collection('chat_messages').add({ data: { openid: OPENID, sessionId: String(event.sessionId || ''), question: lastQuestion, answer, usage, createdAt: new Date() } }).catch(() => {})
  return { ok: true, answer, usage, fromFaq: Boolean(faq) }
}
