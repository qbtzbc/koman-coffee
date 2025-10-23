/**
 * 错误处理中间件
 */

/**
 * 404错误处理
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  // 获取状态码
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // 错误响应对象
  const errorResponse = {
    success: false,
    code: err.code || 'SERVER_ERROR',
    message: err.message || '服务器内部错误'
  };
  
  // 开发环境返回错误堆栈
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  // 记录错误日志
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  res.status(statusCode).json(errorResponse);
};

/**
 * 异步错误包装器
 * 用于包装异步路由处理器，自动捕获错误
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 自定义错误类
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  AppError
};
