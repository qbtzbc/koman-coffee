const request = require('../../utils/request');

Page({
  data: { productId: null, form: { name: '', description: '', category: '', priceMedium: '', priceLarge: '', stock: '' } },
  
  onLoad(options) {
    if (options.id) {
      this.setData({ productId: options.id });
      this.loadProduct(options.id);
    }
  },
  
  loadProduct(id) {
    request.get(`/products/${id}`)
      .then(product => {
        this.setData({
          form: {
            name: product.name,
            description: product.description,
            category: product.category,
            priceMedium: product.price.medium,
            priceLarge: product.price.large,
            stock: product.stock
          }
        });
      });
  },
  
  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },
  
  onSave() {
    const { name, description, category, priceMedium, priceLarge, stock } = this.data.form;
    
    if (!name || !description || !category || !priceMedium || !priceLarge || stock === '') {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    
    const data = {
      name,
      description,
      category,
      price: { medium: parseFloat(priceMedium), large: parseFloat(priceLarge) },
      stock: parseInt(stock),
      images: ['https://via.placeholder.com/400'],
      customOptions: [
        { type: 'size', name: '容量', options: [{ value: 'medium', label: '中杯', default: true }, { value: 'large', label: '大杯' }] },
        { type: 'temperature', name: '温度', options: [{ value: 'hot', label: '热', default: true }, { value: 'ice', label: '冰' }] },
        { type: 'sugar', name: '糖度', options: [{ value: 'none', label: '无糖' }, { value: 'half', label: '半糖', default: true }, { value: 'full', label: '全糖' }] }
      ]
    };
    
    const action = this.data.productId ? 
      request.put(`/products/${this.data.productId}`, data) : 
      request.post('/products', data);
    
    action.then(() => {
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    });
  }
});
