const request = require('../../utils/request');

Page({
  data: { orders: [], currentTab: 'pending_accept' },
  
  onShow() { this.loadOrders(); },
  
  loadOrders() {
    request.get('/orders', { status: this.data.currentTab }, { showLoading: false })
      .then(res => {
        const orders = res.orders.map(o => ({ ...o, statusText: this.getStatusText(o.status), createdTime: this.formatTime(o.createdAt) }));
        this.setData({ orders });
      });
  },
  
  onTabChange(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab });
    this.loadOrders();
  },
  
  onOrderTap(e) {
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${e.currentTarget.dataset.id}` });
  },
  
  getStatusText(status) {
    const map = { pending_accept: '待接单', processing: '制作中', completed: '已完成' };
    return map[status] || status;
  },
  
  formatTime(date) {
    const d = new Date(date);
    return `${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
});
