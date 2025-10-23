const request = require('../../utils/request');
const util = require('../../utils/util');

Page({
  data: { orders: [], currentTab: '', loading: false },
  
  onShow() { this.loadOrders(); },
  
  loadOrders() {
    const app = getApp();
    if (!app.globalData.token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.switchTab({ url: '/pages/profile/profile' }), 1500);
      return;
    }
    
    this.setData({ loading: true });
    const params = this.data.currentTab ? { status: this.data.currentTab } : {};
    
    request.get('/orders', params, { showLoading: false })
      .then(res => {
        const orders = res.orders.map(order => ({
          ...order,
          statusText: util.getOrderStatusText(order.status),
          statusColor: util.getOrderStatusColor(order.status),
          createdTime: util.formatTime(order.createdAt)
        }));
        this.setData({ orders, loading: false });
      })
      .catch(() => this.setData({ loading: false }));
  },
  
  onTabChange(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab });
    this.loadOrders();
  },
  
  onOrderTap(e) {
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${e.currentTarget.dataset.id}` });
  }
});
