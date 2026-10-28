Page({
  data: { messages: [], input: '', loading: false, scrollIntoView: 'message-0', quickQuestions: ['帮我制定今日学习计划', '怎么提交请假申请？', '讲讲英语一般现在时'] },
  onLoad() {
    const app = getApp()
    if (app.globalData.isGuest) {
      wx.showModal({ title: '登录后使用', content: '登录后小启才能使用你的真实姓名并保存学习记录。', showCancel: false, success: () => wx.reLaunch({ url: '/pages/login/login' }) })
      return
    }
    const name = app.globalData.userInfo && app.globalData.userInfo.realName || '同学'
    this.setData({ messages: [{ role: 'ai', text: `你好，${name}！我是小启。英语、数学、学习计划或课程问题，都可以问我。` }] })
    this.sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  },
  onInput(e) { this.setData({ input: e.detail.value }) },
  onQuick(e) { this.setData({ input: e.currentTarget.dataset.question }, () => this.onSend()) },
  async onSend() {
    const question = this.data.input.trim()
    if (!question || this.data.loading) return
    const before = this.data.messages.concat([{ role: 'user', text: question }])
    this.setData({ messages: before, input: '', loading: true, scrollIntoView: `message-${before.length - 1}` })
    try {
      const context = before.slice(-12).map(item => ({ role: item.role, content: item.text }))
      const res = await wx.cloud.callFunction({ name: 'chat', data: { sessionId: this.sessionId, messages: context } })
      if (!res.result || !res.result.ok) throw new Error(res.result?.message || '智能助手没有返回结果')
      const messages = before.concat([{ role: 'ai', text: res.result.answer }])
      this.setData({ messages, loading: false, scrollIntoView: `message-${messages.length - 1}` })
    } catch (error) {
      console.error('智能助手调用失败：', error)
      const message = error.errMsg || error.message || '未知错误'
      this.setData({ messages: before.concat([{ role: 'error', text: `暂时无法回答：${message}` }]), loading: false })
    }
  }
})
