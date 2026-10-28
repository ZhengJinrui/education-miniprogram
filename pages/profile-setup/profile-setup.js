Page({
  data: { avatarUrl: '', realName: '', saving: false, useWechatAvatar: true, avatarChanged: false },
  onLoad() { const app=getApp(); const u=app.globalData.userInfo||{}; this.setData({ useWechatAvatar: app.useWechatAvatar !== false, realName:u.realName||'', avatarUrl:u.avatarUrl||'' }) },
  onChooseAvatar(e) { this.setData({ avatarUrl: e.detail.avatarUrl, avatarChanged: true, useWechatAvatar: true }) },
  async chooseFromAlbum() {
    try { const r=await wx.chooseMedia({count:1,mediaType:['image'],sourceType:['album','camera']}); this.setData({avatarUrl:r.tempFiles[0].tempFilePath,avatarChanged:true,useWechatAvatar:true}) } catch (_) {}
  },
  removeAvatar() { this.setData({ avatarUrl:'', avatarChanged:true, useWechatAvatar:false }) },
  onNameInput(e) { this.setData({ realName:e.detail.value }) },
  async onSave() {
    const name=this.data.realName.trim()
    if (!/^[\u4e00-\u9fa5A-Za-z0-9·_-]{2,20}$/.test(name)) return wx.showToast({title:'请输入2至20位有效名称',icon:'none'})
    this.setData({saving:true})
    try {
      let fileID=this.data.avatarUrl
      if (this.data.avatarChanged && fileID && !fileID.startsWith('cloud://')) {
        const upload=await wx.cloud.uploadFile({cloudPath:`avatars/${getApp().globalData.openid}-${Date.now()}.jpg`,filePath:fileID}); fileID=upload.fileID
      }
      const res=await wx.cloud.callFunction({name:'updateProfile',data:{realName:name,avatarUrl:fileID,clearAvatar:this.data.avatarChanged&&!fileID}})
      if (!res.result||!res.result.ok) throw new Error('云端保存失败')
      const app=getApp(); app.globalData.userInfo=res.result.user; app.loginReady=Promise.resolve({openid:app.globalData.openid,user:res.result.user}); wx.setStorageSync('qichen_user',res.result.user); wx.setStorageSync('qichen_logged_in',true)
      wx.showToast({title:'资料已更新',icon:'success'}); setTimeout(()=>wx.switchTab({url:'/pages/home/home'}),500)
    } catch(e) { this.setData({saving:false}); wx.showModal({title:'保存失败',content:e.errMsg||e.message||'请稍后重试',showCancel:false}) }
  }
})
