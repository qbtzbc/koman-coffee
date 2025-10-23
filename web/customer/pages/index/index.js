/**
 * 首页 - 咖啡列表
 */
const request = require('../../utils/request');

Page({
  data: {
    products: [],
    categories: ['美式', '拿铁', '摩卡', '卡布奇诺'],
    currentCategory: '',
    loading: false,
    page: 1,
    hasMore: true
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.loadProducts();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadProducts(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadProducts();
    }
  },

  /**
   * 加载商品列表
   */
  loadProducts(callback) {
    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      limit: 10
    };

    if (this.data.currentCategory) {
      params.category = this.data.currentCategory;
    }

    request.get('/products', params, { showLoading: false })
      .then(res => {
        const products = this.data.page === 1 ? res.products : [...this.data.products, ...res.products];
        
        this.setData({
          products,
          loading: false,
          hasMore: products.length < res.total
        });

        if (callback) callback();
      })
      .catch(() => {
        this.setData({ loading: false });
        if (callback) callback();
      });
  },

  /**
   * 切换分类
   */
  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    
    this.setData({
      currentCategory: category,
      page: 1,
      hasMore: true
    });
    
    this.loadProducts();
  },

  /**
   * 点击商品卡片
   */
  onProductTap(e) {
    const productId = e.detail.productId;
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${productId}`
    });
  }
});
