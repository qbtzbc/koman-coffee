const request = require('../../utils/request');

Page({
  data: { stats: {} },
  
  onShow() { this.checkLogin(); this.loadStats(); },
  
  checkLogin() {
    const app = getApp();
    if (!app.globalData.token) wx.redirectTo({ url: '/pages/login/login' });
  },
  
  loadStats() {
    request.get('/statistics/overview', { timeRange: 'today' }, { showLoading: false })
      .then(stats => this.setData({ stats }))
      .catch(() => {});
  }
});
