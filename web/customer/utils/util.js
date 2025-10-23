/**
 * 工具函数
 */

/**
 * 格式化价格
 */
const formatPrice = (price) => {
  return `¥${(price / 1).toFixed(2)}`;
};

/**
 * 格式化时间
 */
const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * 格式化日期
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 订单状态文本
 */
const getOrderStatusText = (status) => {
  const statusMap = {
    'pending_payment': '待支付',
    'pending_accept': '待接单',
    'processing': '制作中',
    'completed': '已完成',
    'cancelled': '已取消'
  };
  return statusMap[status] || '未知状态';
};

/**
 * 订单状态颜色
 */
const getOrderStatusColor = (status) => {
  const colorMap = {
    'pending_payment': '#FF9800',
    'pending_accept': '#2196F3',
    'processing': '#4CAF50',
    'completed': '#9E9E9E',
    'cancelled': '#F44336'
  };
  return colorMap[status] || '#000000';
};

/**
 * 定制选项文本
 */
const getCustomizationText = (customization) => {
  if (!customization) return '';
  
  const parts = [];
  
  if (customization.size) {
    const sizeMap = { medium: '中杯', large: '大杯' };
    parts.push(sizeMap[customization.size] || customization.size);
  }
  
  if (customization.temperature) {
    const tempMap = { hot: '热', ice: '冰' };
    parts.push(tempMap[customization.temperature] || customization.temperature);
  }
  
  if (customization.sugar) {
    const sugarMap = { none: '无糖', half: '半糖', full: '全糖' };
    parts.push(sugarMap[customization.sugar] || customization.sugar);
  }
  
  return parts.join(' / ');
};

/**
 * 防抖函数
 */
const debounce = (func, wait = 500) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

/**
 * 节流函数
 */
const throttle = (func, wait = 500) => {
  let previous = 0;
  return function(...args) {
    const now = Date.now();
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    }
  };
};

module.exports = {
  formatPrice,
  formatTime,
  formatDate,
  getOrderStatusText,
  getOrderStatusColor,
  getCustomizationText,
  debounce,
  throttle
};
