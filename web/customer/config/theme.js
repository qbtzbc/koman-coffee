/**
 * Koman Coffee 视觉设计规范
 * 统一管理颜色、字体、间距等视觉元素
 */

module.exports = {
  // 色彩系统
  colors: {
    // 主色调
    primary: '#6B4423',      // 品牌咖啡色
    primaryLight: '#8B5A2B', // 辅助色
    primaryDark: '#4A2F17',  // 深咖啡色
    
    // 背景色
    bgPrimary: '#FFFFFF',    // 主背景（卡片、弹窗）
    bgSecondary: '#FFF9F0',  // 辅助背景（页面整体）
    bgGray: '#F5F5F5',       // 灰色背景
    
    // 文字颜色
    textPrimary: '#333333',  // 主文字（标题、重要信息）
    textSecondary: '#666666',// 辅助文字（正文、描述）
    textTertiary: '#999999', // 弱文字（次要信息、占位符）
    textWhite: '#FFFFFF',    // 白色文字
    
    // 边框色
    border: '#EEEEEE',       // 分割线、卡片边框
    borderLight: '#F5F5F5',  // 浅边框
    
    // 状态色
    success: '#52C41A',      // 成功提示、库存充足
    warning: '#FAAD14',      // 警告提示、库存不足
    error: '#F5222D',        // 错误提示、售罄
    info: '#1890FF',         // 信息提示
    
    // 特殊色
    price: '#FF6B6B',        // 价格高亮色
    discount: '#FF4D4F',     // 折扣标签
  },

  // 字体规范
  fontSize: {
    // 标题
    h1: 36,  // 一级标题（页面主标题）
    h2: 32,  // 二级标题（模块标题、商品名称）
    h3: 28,  // 三级标题（卡片标题、分类名称）
    
    // 正文
    body: 28,    // 正文（商品描述、订单详情）
    small: 24,   // 辅助文字（提示信息、副标题）
    mini: 20,    // 说明文字（标签、时间戳）
  },

  // 字重
  fontWeight: {
    normal: 400,  // 常规
    medium: 500,  // 中等
    bold: 700,    // 粗体
  },

  // 间距系统
  spacing: {
    xs: 8,   // 超小间距（文字与图标间距）
    sm: 16,  // 小间距（卡片内元素间距）
    md: 24,  // 中间距（卡片内边距、按钮内边距）
    lg: 32,  // 大间距（模块间距、页面边距）
    xl: 48,  // 超大间距（区块分隔）
  },

  // 圆角规范
  borderRadius: {
    sm: 8,   // 小圆角（小按钮、标签）
    md: 12,  // 中圆角（普通按钮、输入框、图片容器）
    lg: 16,  // 大圆角（卡片）
    xl: 24,  // 超大圆角（模态框）
    round: 9999, // 圆形
  },

  // 阴影规范
  shadow: {
    card: '0 4rpx 12rpx rgba(0, 0, 0, 0.08)',     // 卡片阴影
    button: '0 4rpx 12rpx rgba(107, 68, 35, 0.3)', // 按钮阴影
    modal: '0 8rpx 24rpx rgba(0, 0, 0, 0.15)',     // 模态框阴影
  },

  // 动画时长
  duration: {
    fast: 150,    // 快速动画（按钮点击）
    normal: 250,  // 常规动画（模态框弹出）
    slow: 300,    // 慢速动画（页面切换）
  },

  // 层级
  zIndex: {
    base: 1,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    toast: 500,
    loading: 9999,
  },
};
