/**
 * 生产环境配置
 */
module.exports = {
  // API 基础地址（生产环境域名）
  API_BASE_URL: 'https://api.koman-coffee.com/api',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 15000,
  
  // 是否启用 Mock 数据
  ENABLE_MOCK: false,
  
  // 是否启用调试日志
  DEBUG: false,
  
  // 环境名称
  ENV_NAME: 'production',
  
  // 微信小程序 AppID（正式版）
  // APP_ID: 'your-production-appid'
};
