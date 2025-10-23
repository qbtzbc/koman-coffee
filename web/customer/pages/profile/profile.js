const request = require('../../utils/request');

Page({
  data: { userInfo: {}, isLogin: false },
  
  onShow() {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo || {},
      isLogin: !!app.globalData.token
    });
  },
  
  onLogin() {
    wx.login({
      success: (res) => {
        request.post('/user/login', { code: res.code })
          .then(data => {
            const app = getApp();
            app.saveUserInfo(data.token, data.userInfo);
            this.setData({ userInfo: data.userInfo, isLogin: true });
            wx.showToast({ title: '登录成功', icon: 'success' });
          });
      }
    });
  },
  
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.clearUserInfo();
          this.setData({ userInfo: {}, isLogin: false });
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  }
});
