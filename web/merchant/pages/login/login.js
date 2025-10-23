const request = require('../../utils/request');

Page({
  data: { account: '', password: '' },
  
  onAccountInput(e) { this.setData({ account: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  
  onLogin() {
    const { account, password } = this.data;
    if (!account || !password) {
      wx.showToast({ title: '请输入账号和密码', icon: 'none' });
      return;
    }
    
    request.post('/merchant/login', { account, password })
      .then(data => {
        const app = getApp();
        app.saveMerchantInfo(data.token, data.merchantInfo);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => {
          wx.switchTab({ url: '/pages/home/home' });
        }, 1500);
      });
  }
});
