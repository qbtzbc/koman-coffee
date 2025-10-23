const request = require('../../utils/request');
const util = require('../../utils/util');

Page({
  data: { order: null },
  
  onLoad(options) {
    if (options.id) this.loadOrderDetail(options.id);
  },
  
  loadOrderDetail(id) {
    request.get(`/orders/${id}`)
      .then(order => {
        this.setData({
          order: {
            ...order,
            statusText: util.getOrderStatusText(order.status),
            statusColor: util.getOrderStatusColor(order.status),
            createdTime: util.formatTime(order.createdAt),
            paidTime: util.formatTime(order.paidAt)
          }
        });
      });
  },
  
  onPay() {
    wx.showModal({
      title: '模拟支付',
      content: '确认支付订单？',
      success: (res) => {
        if (res.confirm) {
          request.put(`/orders/${this.data.order._id}/pay`)
            .then(() => {
              wx.showToast({ title: '支付成功', icon: 'success' });
              this.loadOrderDetail(this.data.order._id);
            });
        }
      }
    });
  }
});
