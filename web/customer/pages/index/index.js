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
    hasMore: true,
    showLoading: true, // 显示启动加载动画
    firstLoad: true // 是否首次加载
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 首次加载显示加载动画
    const app = getApp();
    if (this.data.firstLoad) {
      this.setData({ showLoading: true });
      
      // 加载数据
      this.loadProducts();
    } else {
      this.loadProducts();
    }
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

        // 首次加载完成，隐藏加载动画
        if (this.data.firstLoad) {
          this.hideLoadingAnimation();
        }

        if (callback) callback();
      })
      .catch(() => {
        this.setData({ loading: false });
        
        // 首次加载失败，也要隐藏动画
        if (this.data.firstLoad) {
          this.hideLoadingAnimation();
        }
        
        if (callback) callback();
      });
  },

  /**
   * 隐藏加载动画
   */
  hideLoadingAnimation() {
    // 获取加载组件并调用finishLoading
    const loadingComponent = this.selectComponent('#app-loading');
    if (loadingComponent) {
      loadingComponent.finishLoading();
    }
    
    // 标记为非首次加载
    this.setData({ 
      firstLoad: false,
      showLoading: false 
    });
  },

  /**
   * 加载动画隐藏事件
   */
  onLoadingHide() {
    this.setData({ showLoading: false });
  },

  /**
   * 加载超时事件
   */
  onLoadingTimeout() {
    console.log('加载超时');
    wx.showToast({
      title: '网络请求超时',
      icon: 'none'
    });
  },

  /**
   * 重试加载
   */
  onLoadingRetry() {
    console.log('重试加载');
    this.setData({ 
      page: 1,
      hasMore: true 
    });
    this.loadProducts();
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
