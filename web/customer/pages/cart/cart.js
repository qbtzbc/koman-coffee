const request = require('../../utils/request');
const util = require('../../utils/util');

Page({
  data: { cartItems: [], totalPrice: 0 },
  
  onShow() { this.loadCart(); },
  
  loadCart() {
    const app = getApp();
    const cart = app.globalData.cart.map(item => ({
      ...item,
      customText: util.getCustomizationText(item.customization)
    }));
    
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    this.setData({ cartItems: cart, totalPrice });
  },
  
  onDecrease(e) {
    const app = getApp();
    app.updateCartQuantity(e.currentTarget.dataset.index, this.data.cartItems[e.currentTarget.dataset.index].quantity - 1);
    this.loadCart();
  },
  
  onIncrease(e) {
    const app = getApp();
    app.updateCartQuantity(e.currentTarget.dataset.index, this.data.cartItems[e.currentTarget.dataset.index].quantity + 1);
    this.loadCart();
  },
  
  onDelete(e) {
    const app = getApp();
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗?',
      success: (res) => {
        if (res.confirm) {
          app.removeFromCart(e.currentTarget.dataset.index);
          this.loadCart();
        }
      }
    });
  },
  
  onCheckout() {
    const app = getApp();
    if (!app.globalData.token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    
    const items = this.data.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      customization: item.customization
    }));
    
    wx.showLoading({ title: '创建订单中...' });
    request.post('/orders', { items })
      .then(order => {
        wx.hideLoading();
        app.clearCart();
        wx.showModal({
          title: '订单创建成功',
          content: `订单号: ${order.orderNo}`,
          showCancel: false,
          success: () => {
            wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${order.orderId}` });
          }
        });
      })
      .catch(() => {
        wx.hideLoading();
      });
  }
});
