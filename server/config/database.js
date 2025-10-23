/**
 * 数据库配置文件
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

/**
 * 连接数据库
 */
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB 连接成功: ${mongoURI}`);
    
    // 监听连接错误
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
    });
    
    // 监听断开连接
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 连接已断开');
    });
    
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

/**
 * 关闭数据库连接
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB 连接已关闭');
  } catch (error) {
    console.error('关闭 MongoDB 连接失败:', error);
  }
};

module.exports = {
  connectDB,
  closeDB,
  mongoURI
};
