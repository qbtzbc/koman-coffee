const request = require('../../utils/request');

Page({
  data: { products: [] },
  
  onShow() { this.loadProducts(); },
  
  loadProducts() {
    request.get('/products', {}, { showLoading: false })
      .then(res => this.setData({ products: res.products }));
  },
  
  onAdd() { wx.navigateTo({ url: '/pages/product-edit/product-edit' }); },
  
  onEdit(e) {
    wx.navigateTo({ url: `/pages/product-edit/product-edit?id=${e.currentTarget.dataset.id}` });
  },
  
  onDelete(e) {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          request.del(`/products/${e.currentTarget.dataset.id}`)
            .then(() => {
              wx.showToast({ title: '删除成功', icon: 'success' });
              this.loadProducts();
            });
        }
      }
    });
  }
});
