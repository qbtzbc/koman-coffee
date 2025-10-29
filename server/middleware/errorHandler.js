/**
 * 错误处理中间件
 * 提供统一的错误分类和处理机制
 */

const { v4: uuidv4 } = require('uuid') || { v4: () => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
const logger = require('../config/logger');

/**
 * 自定义错误类
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'SERVER_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 预定义错误类型
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = '身份验证失败') {
    super(message, 401, 'AUTHENTICATION_FAILED');
  }
}

class AuthorizationError extends AppError {
  constructor(message = '没有权限访问该资源') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(message = '请求的资源不存在', resource = null) {
    super(message, 404, 'NOT_FOUND', resource ? { resource } : null);
  }
}

class BusinessError extends AppError {
  constructor(message, details = null) {
    super(message, 422, 'BUSINESS_ERROR', details);
  }
}

class DatabaseError extends AppError {
  constructor(message = '数据库操作失败') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

class ExternalServiceError extends AppError {
  constructor(message = '外部服务暂时不可用', service = null) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', service ? { service } : null);
  }
}

/**
 * 404错误处理
 */
const notFound = (req, res, next) => {
  const error = new NotFoundError(`接口不存在 - ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * 生成请求ID
 */
const generateRequestId = () => {
  try {
    return uuidv4();
  } catch (e) {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  // 生成请求追踪ID
  const requestId = req.id || generateRequestId();
  
  // 确定状态码
  let statusCode = 500;
  if (err.statusCode) {
    statusCode = err.statusCode;
  } else if (res.statusCode !== 200) {
    statusCode = res.statusCode;
  }
  
  // 处理Mongoose验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    err.errorCode = 'VALIDATION_ERROR';
    err.message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  
  // 处理Mongoose重复键错误
  if (err.code === 11000) {
    statusCode = 409;
    err.errorCode = 'DUPLICATE_ERROR';
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field} 已存在`;
  }
  
  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    err.errorCode = 'INVALID_TOKEN';
    err.message = '无效的身份验证令牌';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    err.errorCode = 'TOKEN_EXPIRED';
    err.message = '身份验证令牌已过期';
  }
  
  // 错误响应对象
  const errorResponse = {
    success: false,
    errorCode: err.errorCode || 'SERVER_ERROR',
    message: err.message || '服务器内部错误',
    timestamp: new Date().toISOString(),
    requestId: requestId,
    path: req.originalUrl
  };
  
  // 开发环境返回详细信息
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    if (err.details) {
      errorResponse.details = err.details;
    }
  }
  
  // 记录错误日志
  const logData = {
    requestId,
    statusCode,
    errorCode: err.errorCode,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };
  
  // 如果是服务器错误，记录堆栈
  if (statusCode >= 500) {
    logData.stack = err.stack;
    logger.error(err.message, logData);
  } else {
    logger.warn(err.message, logData);
  }
  
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
 * 请求ID中间件（为每个请求生成唯一ID）
 */
const requestId = (req, res, next) => {
  req.id = generateRequestId();
  res.setHeader('X-Request-Id', req.id);
  next();
};

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  requestId,
  // 错误类
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  BusinessError,
  DatabaseError,
  ExternalServiceError
};
