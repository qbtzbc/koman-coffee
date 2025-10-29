/**
 * 数据库配置文件
 * 支持自动重连、健康检查和连接池管理
 */
const mongoose = require('mongoose');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '27017',
  DB_NAME = 'koman_coffee',
  NODE_ENV = 'development'
} = process.env;

// 构建MongoDB连接字符串
const mongoURI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// 连接状态
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL = [1000, 2000, 4000]; // 递增重试间隔

/**
 * 连接数据库（支持自动重连）
 */
const connectDB = async (retryCount = 0) => {
  if (isConnecting) {
    console.log('数据库连接正在进行中，跳过重复连接...');
    return;
  }

  isConnecting = true;

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10秒超时
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // 最大连接池数量
      minPoolSize: 5,  // 最小连接池数量
      heartbeatFrequencyMS: 30000, // 30秒心跳检测
    };

    await mongoose.connect(mongoURI, options);
    
    console.log(`✓ MongoDB 连接成功: ${mongoURI}`);
    reconnectAttempts = 0; // 重置重连计数
    isConnecting = false;
    
    // 监听连接事件
    setupConnectionListeners();
    
  } catch (error) {
    isConnecting = false;
    console.error(`✗ MongoDB 连接失败 (尝试 ${retryCount + 1}/${MAX_RECONNECT_ATTEMPTS}):`, error.message);
    
    // 自动重连逻辑
    if (retryCount < MAX_RECONNECT_ATTEMPTS) {
      const delay = RECONNECT_INTERVAL[retryCount] || RECONNECT_INTERVAL[RECONNECT_INTERVAL.length - 1];
      console.log(`将在 ${delay / 1000} 秒后重试连接...`);
      
      setTimeout(() => {
        connectDB(retryCount + 1);
      }, delay);
    } else {
      console.error('\n========== 数据库连接失败诊断信息 ==========');
      console.error('错误原因:', error.message);
      console.error('连接地址:', mongoURI);
      console.error('Node.js 版本:', process.version);
      console.error('环境变量:', { DB_HOST, DB_PORT, DB_NAME, NODE_ENV });
      console.error('\n排查建议:');
      console.error('1. 检查 MongoDB 服务是否已启动');
      console.error('   - macOS: brew services list | grep mongodb');
      console.error('   - Linux: systemctl status mongod');
      console.error('   - Windows: sc query MongoDB');
      console.error('2. 检查连接地址和端口是否正确');
      console.error('3. 检查网络防火墙设置');
      console.error('4. 查看 MongoDB 日志文件');
      console.error('==========================================\n');
      
      // 不再直接退出，而是进入降级模式
      console.warn('⚠ 应用将在降级模式下启动（数据库功能不可用）');
      console.warn('请修复数据库连接问题后重启应用');
    }
  }
};

/**
 * 设置连接监听器
 */
function setupConnectionListeners() {
  // 连接错误处理
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB 连接错误:', err.message);
  });
  
  // 断开连接处理（自动重连）
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB 连接已断开');
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log('尝试自动重连...');
      reconnectAttempts++;
      setTimeout(() => {
        connectDB(reconnectAttempts - 1);
      }, RECONNECT_INTERVAL[Math.min(reconnectAttempts - 1, RECONNECT_INTERVAL.length - 1)]);
    }
  });
  
  // 重新连接成功
  mongoose.connection.on('reconnected', () => {
    console.log('✓ MongoDB 重新连接成功');
    reconnectAttempts = 0;
  });
}

/**
 * 关闭数据库连接
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✓ MongoDB 连接已优雅关闭');
  } catch (error) {
    console.error('✗ 关闭 MongoDB 连接失败:', error);
  }
};

/**
 * 检查数据库连接状态
 */
const checkDBConnection = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING'
  };
  
  return {
    isConnected: state === 1,
    state: states[state] || 'UNKNOWN',
    stateCode: state
  };
};

/**
 * 获取数据库健康信息
 */
const getDBHealth = async () => {
  const status = checkDBConnection();
  
  if (!status.isConnected) {
    return {
      status: 'DOWN',
      state: status.state,
      message: '数据库未连接'
    };
  }
  
  try {
    // 执行 ping 命令测试连接
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const latency = Date.now() - startTime;
    
    return {
      status: 'UP',
      state: status.state,
      latency: `${latency}ms`,
      database: DB_NAME,
      host: `${DB_HOST}:${DB_PORT}`
    };
  } catch (error) {
    return {
      status: 'DOWN',
      state: status.state,
      message: error.message
    };
  }
};

module.exports = {
  connectDB,
  closeDB,
  checkDBConnection,
  getDBHealth,
  mongoURI
};
