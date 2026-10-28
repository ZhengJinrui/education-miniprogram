const courses=[{name:'新概念英语一',teacher:'王老师',price:'¥1,280',color:'#efb071',mark:'A1'},{name:'新概念英语二',teacher:'周老师',price:'¥1,680',color:'#8db0ca',mark:'A2'},{name:'高思数学三年级',teacher:'陈老师',price:'¥1,480',color:'#9fc0ab',mark:'∑'}]
Page({
  data:{courses,studentName:'同学'},
  onShow(){const app=getApp();const user=app.globalData.userInfo||{};const realName=wx.getStorageSync('qichen_real_name_v2')||(user.realNameSetByUser&&user.realName)||'';if(!app.globalData.isGuest&&!realName){wx.redirectTo({url:'/pages/profile-setup/profile-setup'});return}this.setData({studentName:app.globalData.isGuest?'游客':realName})},
  onCourse(e){wx.navigateTo({url:'/pages/course-detail/course-detail?name='+encodeURIComponent(e.currentTarget.dataset.name)})},
  requireLogin(content){if(!getApp().globalData.isGuest)return true;wx.showModal({title:'请先登录',content,confirmText:'去登录',success:r=>{if(r.confirm)wx.reLaunch({url:'/pages/login/login'})}});return false},
  onLeave(){if(this.requireLogin('登录后才能提交请假申请。'))wx.navigateTo({url:'/pages/leave/leave'})},
  onAsk(){if(this.requireLogin('登录后才能使用智能助手并保存学习记录。'))wx.navigateTo({url:'/pages/assistant/assistant'})}
})
