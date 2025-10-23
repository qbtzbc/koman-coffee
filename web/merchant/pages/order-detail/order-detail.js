const request = require('../../utils/request');

Page({
  data: { order: null },
  
  onLoad(options) { if (options.id) this.loadOrder(options.id); },
  
  loadOrder(id) {
    request.get(`/orders/${id}`)
      .then(order => this.setData({ order: { ...order, statusText: this.getStatusText(order.status) } }));
  },
  
  onAccept() {
    request.put(`/orders/${this.data.order._id}/accept`)
      .then(() => {
        wx.showToast({ title: '接单成功', icon: 'success' });
        this.loadOrder(this.data.order._id);
      });
  },
  
  onComplete() {
    request.put(`/orders/${this.data.order._id}/complete`)
      .then(() => {
        wx.showToast({ title: '订单完成', icon: 'success' });
        this.loadOrder(this.data.order._id);
      });
  },
  
  getStatusText(status) {
    const map = { pending_accept: '待接单', processing: '制作中', completed: '已完成' };
    return map[status] || status;
  }
});
