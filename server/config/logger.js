/**
 * 日志系统配置
 * 使用 winston 实现结构化日志管理
 */

const path = require('path');
const fs = require('fs');

// 创建日志目录
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志级别定义
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 日志颜色配置
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// 简化版日志实现（不依赖 winston）
class Logger {
  constructor() {
    this.logDir = logDir;
    this.currentDate = new Date().toISOString().split('T')[0];
    this.logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
  }

  // 格式化日志消息
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    return JSON.stringify(logEntry);
  }

  // 写入日志文件
  writeToFile(filename, message) {
    const filepath = path.join(this.logDir, filename);
    const logMessage = message + '\n';

    try {
      fs.appendFileSync(filepath, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  // 判断是否应该输出该级别的日志
  shouldLog(level) {
    const currentLevelValue = levels[this.logLevel] || 2;
    const requestedLevelValue = levels[level] || 2;
    return requestedLevelValue <= currentLevelValue;
  }

  // 核心日志方法
  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, meta);

    // 控制台输出（带颜色）
    const colorCode = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[32m',
      http: '\x1b[35m',
      debug: '\x1b[37m'
    }[level] || '\x1b[0m';
    const resetCode = '\x1b[0m';

    console.log(`${colorCode}[${level.toUpperCase()}]${resetCode} ${message}`, meta);

    // 写入综合日志文件
    this.writeToFile('application.log', formattedMessage);

    // 错误日志单独写入
    if (level === 'error') {
      this.writeToFile('error.log', formattedMessage);
    }

    // 访问日志
    if (level === 'http') {
      this.writeToFile('access.log', formattedMessage);
    }
  }

  // 便捷方法
  error(message, meta) {
    this.log('error', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  http(message, meta) {
    this.log('http', message, meta);
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }

  // HTTP 请求日志中间件
  httpLogger() {
    return (req, res, next) => {
      const startTime = Date.now();

      // 监听响应完成
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const meta = {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          requestId: req.id
        };

        // 根据状态码选择日志级别
        let level = 'http';
        if (res.statusCode >= 500) {
          level = 'error';
        } else if (res.statusCode >= 400) {
          level = 'warn';
        }

        this.log(level, `${req.method} ${req.originalUrl} ${res.statusCode}`, meta);
      });

      next();
    };
  }

  // 获取日志统计信息
  getStats() {
    try {
      const files = ['application.log', 'error.log', 'access.log'];
      const stats = {};

      files.forEach(file => {
        const filepath = path.join(this.logDir, file);
        if (fs.existsSync(filepath)) {
          const stat = fs.statSync(filepath);
          stats[file] = {
            size: `${(stat.size / 1024).toFixed(2)} KB`,
            modified: stat.mtime
          };
        }
      });

      return stats;
    } catch (error) {
      return { error: error.message };
    }
  }

  // 清理旧日志（可选）
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      files.forEach(file => {
        const filepath = path.join(this.logDir, file);
        const stat = fs.statSync(filepath);

        if (now - stat.mtime.getTime() > maxAge) {
          fs.unlinkSync(filepath);
          this.info(`Cleaned old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', { error: error.message });
    }
  }
}

// 创建单例实例
const logger = new Logger();

module.exports = logger;
