/**
 * Koman Coffee 后端服务入口
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// 导入路由
const userRoutes = require('./routes/user');
const merchantRoutes = require('./routes/merchant');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const statisticsRoutes = require('./routes/statistics');
const uploadRoutes = require('./routes/upload');

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors()); // 跨域支持
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// 静态文件服务（用于访问上传的图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api/user', userRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Koman Coffee API is running',
    timestamp: new Date().toISOString()
  });
});

// 404错误处理
app.use(notFound);

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   Koman Coffee API Server Started     ║
  ╠════════════════════════════════════════╣
  ║   Port: ${PORT}                           ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}          ║
  ║   Time: ${new Date().toLocaleString()}  ║
  ╚════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

module.exports = app;
