Page({
  data: { loading: false, error: '', agreed: false, useWechatProfile: true },
  async onLoad() {
    if (!wx.getStorageSync('qichen_logged_in')) return
    this.setData({ loading: true })
    try { await getApp().login(true); wx.switchTab({ url: '/pages/home/home' }) }
    catch (_) { this.setData({ loading: false }) }
  },
  onAgreementChange(e) { this.setData({ agreed: e.detail.value.includes('agreed') }) },
  onProfileChoice(e) { this.setData({ useWechatProfile: e.detail.value.includes('profile') }) },
  ensureAgreed() { if (this.data.agreed) return true; wx.showToast({ title: '请先阅读并勾选协议', icon: 'none' }); return false },
  async onLogin() {
    if (!this.ensureAgreed() || this.data.loading) return
    this.setData({ loading: true, error: '' })
    try {
      const app = getApp(); app.useWechatAvatar = this.data.useWechatProfile
      const result = await app.login(true)
      if (!this.data.useWechatProfile) {
        const res = await wx.cloud.callFunction({ name: 'updateProfile', data: { randomize: true, mode: 'random' } })
        if (!res.result || !res.result.ok) throw new Error('随机身份生成失败')
        if (res.result.version !== '2026-10-27-random-identity-v2') throw new Error('updateProfile 云函数仍是旧版本，请重新部署')
        result.user = res.result.user; app.globalData.userInfo = res.result.user
        app.loginReady = Promise.resolve({ openid: app.globalData.openid, user: res.result.user })
        wx.setStorageSync('qichen_user', res.result.user)
      }
      wx.setStorageSync('qichen_logged_in', true)
      wx.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        if (!this.data.useWechatProfile || (result.user && result.user.profileCompleted)) wx.switchTab({ url: '/pages/home/home' })
        else wx.redirectTo({ url: '/pages/profile-setup/profile-setup' })
      }, 400)
    } catch (error) { this.setData({ loading: false, error: error.errMsg || error.message || '登录失败，请重试' }) }
  },
  onExperience() { if (!this.ensureAgreed()) return; const app=getApp(); app.globalData.userInfo=null; app.globalData.openid=''; app.globalData.isGuest=true; app.loginReady=null; wx.removeStorageSync('qichen_logged_in'); wx.switchTab({url:'/pages/home/home'}) },
  openAgreement() { wx.navigateTo({url:'/pages/agreement/agreement'}) }, openPrivacy() { wx.navigateTo({url:'/pages/privacy/privacy'}) }
})
