/**
 * 环境配置加载器
 * 根据微信小程序运行环境自动加载对应配置
 */

// 导入各环境配置
const devConfig = require('./env.dev');
const testConfig = require('./env.test');
const prodConfig = require('./env.prod');

/**
 * 获取当前运行环境
 */
function getEnv() {
  // 获取小程序账号信息
  const accountInfo = wx.getAccountInfoSync();
  
  if (accountInfo && accountInfo.miniProgram) {
    const envVersion = accountInfo.miniProgram.envVersion;
    
    // envVersion 可能的值：
    // - 'develop'：开发版
    // - 'trial'：体验版
    // - 'release'：正式版
    
    if (envVersion === 'release') {
      return 'production';
    } else if (envVersion === 'trial') {
      return 'test';
    } else {
      return 'development';
    }
  }
  
  // 默认返回开发环境
  return 'development';
}

/**
 * 加载环境配置
 */
function loadConfig() {
  const env = getEnv();
  
  let config;
  switch (env) {
    case 'production':
      config = prodConfig;
      break;
    case 'test':
      config = testConfig;
      break;
    case 'development':
    default:
      config = devConfig;
      break;
  }
  
  // 打印当前环境信息（仅开发环境）
  if (config.DEBUG) {
    console.log('[Config] Current Environment:', env);
    console.log('[Config] API Base URL:', config.API_BASE_URL);
  }
  
  return config;
}

// 导出配置
module.exports = loadConfig();
