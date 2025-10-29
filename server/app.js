/**
 * Koman Coffee 后端服务入口
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB, getDBHealth } = require('./config/database');
const logger = require('./config/logger');
const { notFound, errorHandler, requestId } = require('./middleware/errorHandler');

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
app.use(requestId); // 请求ID追踪
app.use(logger.httpLogger()); // HTTP请求日志
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

// 健康检查接口（增强版）
app.get('/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // 检查数据库健康
    const dbHealth = await getDBHealth();
    
    // 检查内存使用情况
    const memUsage = process.memoryUsage();
    const memoryInfo = {
      used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      status: memUsage.heapUsed / memUsage.heapTotal > 0.9 ? 'WARNING' : 'OK'
    };
    
    // 计算运行时间
    const uptime = Math.floor(process.uptime());
    const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`;
    
    // 获取日志统计
    const logStats = logger.getStats();
    
    // 判断整体健康状态
    let overallStatus = 'HEALTHY';
    let statusCode = 200;
    
    if (dbHealth.status === 'DOWN') {
      overallStatus = 'UNHEALTHY';
      statusCode = 503;
    } else if (memoryInfo.status === 'WARNING') {
      overallStatus = 'DEGRADED';
    }
    
    const healthResponse = {
      success: true,
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: uptimeStr,
      checks: {
        database: dbHealth,
        memory: memoryInfo,
        logs: logStats
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid
      },
      responseTime: `${Date.now() - startTime}ms`
    };
    
    res.status(statusCode).json(healthResponse);
    
  } catch (error) {
    logger.error('健康检查失败', { error: error.message });
    res.status(503).json({
      success: false,
      status: 'UNHEALTHY',
      message: '健康检查执行失败',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
