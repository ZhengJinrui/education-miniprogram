Page({onStart(){wx.showActionSheet({itemList:['苹果','香蕉','橘子'],success:r=>wx.showToast({title:r.tapIndex===0?'回答正确 +10 积分':'再想一想',icon:r.tapIndex===0?'success':'none'})})}})
