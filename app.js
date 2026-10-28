App({
  globalData: { userInfo: null, openid: '', points: 0, isGuest: false },
  onLaunch() {
    if (!wx.cloud) return console.error('当前基础库不支持云开发')
    // 公开代码不写入具体云环境 ID，默认使用当前小程序绑定的云环境。
    wx.cloud.init({ traceUser: true })
  },
  login(force = false) {
    if (force) this.loginReady = null
    if (this.loginReady) return this.loginReady
    this.loginReady = wx.cloud.callFunction({ name: 'login' }).then(({ result }) => {
      if (!result || !result.openid) throw new Error('登录云函数没有返回 openid')
      this.globalData.openid = result.openid
      this.globalData.userInfo = result.user
      this.globalData.isGuest = false
      wx.setStorageSync('qichen_user', result.user)
      return result
    }).catch(error => { this.loginReady = null; throw error })
    return this.loginReady
  }
})
