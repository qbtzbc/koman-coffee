/**
 * 商品详情页
 */
const request = require('../../utils/request');

Page({
  data: {
    product: null,
    customization: {},
    quantity: 1,
    currentPrice: 0,
    totalPrice: 0
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadProductDetail(id);
    }
  },

  /**
   * 加载商品详情
   */
  loadProductDetail(id) {
    request.get(`/products/${id}`)
      .then(product => {
        this.setData({ product });
        this.calculatePrice();
      })
      .catch(() => {
        wx.showToast({
          title: '商品不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      });
  },

  /**
   * 定制选项变化
   */
  onCustomChange(e) {
    this.setData({
      customization: e.detail.customization
    });
    this.calculatePrice();
  },

  /**
   * 计算价格
   */
  calculatePrice() {
    const { product, customization, quantity } = this.data;
    
    if (!product) return;

    // 根据选择的尺寸计算价格
    const size = customization.size || 'medium';
    const currentPrice = product.price[size];
    const totalPrice = (currentPrice * quantity).toFixed(2);

    this.setData({
      currentPrice,
      totalPrice
    });
  },

  /**
   * 减少数量
   */
  onQuantityDecrease() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
      this.calculatePrice();
    }
  },

  /**
   * 增加数量
   */
  onQuantityIncrease() {
    const { product, quantity } = this.data;
    
    if (quantity < product.stock) {
      this.setData({
        quantity: quantity + 1
      });
      this.calculatePrice();
    } else {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      });
    }
  },

  /**
   * 加入购物车
   */
  onAddToCart() {
    const { product, customization, quantity, currentPrice } = this.data;
    
    const app = getApp();
    app.addToCart({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0],
      price: currentPrice,
      quantity,
      customization
    });

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  /**
   * 立即购买
   */
  onBuyNow() {
    const { product, customization, quantity, currentPrice } = this.data;
    
    // 将商品数据传递到购物车页面
    const app = getApp();
    app.globalData.tempOrder = [{
      productId: product._id,
      productName: product.name,
      productImage: product.images[0],
      price: currentPrice,
      quantity,
      customization
    }];

    wx.navigateTo({
      url: '/pages/cart/cart?from=buy'
    });
  }
});
