/**
 * 顾客端小程序 - 全局应用程序
 */
App({
  // 全局数据
  globalData: {
    userInfo: null,
    token: null,
    cart: [] // 购物车数据
  },

  /**
   * 小程序初始化
   */
  onLaunch() {
    console.log('Koman Coffee 顾客端启动');
    
    // 从本地存储加载用户信息
    this.loadUserInfo();
    
    // 从本地存储加载购物车
    this.loadCart();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  /**
   * 保存用户信息
   */
  saveUserInfo(token, userInfo) {
    this.globalData.token = token;
    this.globalData.userInfo = userInfo;
    
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
  },

  /**
   * 清除用户信息
   */
  clearUserInfo() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  /**
   * 加载购物车
   */
  loadCart() {
    const cart = wx.getStorageSync('cart');
    if (cart) {
      this.globalData.cart = cart;
    }
  },

  /**
   * 保存购物车
   */
  saveCart(cart) {
    this.globalData.cart = cart;
    wx.setStorageSync('cart', cart);
  },

  /**
   * 添加商品到购物车
   */
  addToCart(product) {
    const cart = this.globalData.cart;
    
    // 检查是否已存在相同定制的商品
    const existingIndex = cart.findIndex(item => 
      item.productId === product.productId &&
      JSON.stringify(item.customization) === JSON.stringify(product.customization)
    );
    
    if (existingIndex > -1) {
      // 已存在，增加数量
      cart[existingIndex].quantity += product.quantity;
    } else {
      // 不存在，添加新商品
      cart.push(product);
    }
    
    this.saveCart(cart);
  },

  /**
   * 从购物车移除商品
   */
  removeFromCart(index) {
    const cart = this.globalData.cart;
    cart.splice(index, 1);
    this.saveCart(cart);
  },

  /**
   * 更新购物车商品数量
   */
  updateCartQuantity(index, quantity) {
    const cart = this.globalData.cart;
    if (quantity <= 0) {
      this.removeFromCart(index);
    } else {
      cart[index].quantity = quantity;
      this.saveCart(cart);
    }
  },

  /**
   * 清空购物车
   */
  clearCart() {
    this.globalData.cart = [];
    wx.removeStorageSync('cart');
  },

  /**
   * 获取购物车商品总数
   */
  getCartTotal() {
    return this.globalData.cart.reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * 计算购物车总价
   */
  getCartTotalPrice() {
    return this.globalData.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
});
