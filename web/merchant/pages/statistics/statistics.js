const request = require('../../utils/request');

Page({
  data: { stats: {}, topProducts: [] },
  
  onShow() { this.loadStats(); this.loadTopProducts(); },
  
  loadStats() {
    request.get('/statistics/overview', { timeRange: 'today' }, { showLoading: false })
      .then(stats => this.setData({ stats }));
  },
  
  loadTopProducts() {
    request.get('/statistics/products', { limit: 5 }, { showLoading: false })
      .then(res => this.setData({ topProducts: res.topProducts }));
  }
});
