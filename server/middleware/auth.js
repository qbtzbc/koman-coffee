/**
 * 认证中间件
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

/**
 * 用户认证中间件
 */
const authUser = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: '未提供认证令牌'
      });
    }
    
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 检查是否为用户token
    if (decoded.type !== 'user') {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: '无效的认证令牌'
      });
    }
    
    // 将用户信息注入到请求对象
    req.user = {
      userId: decoded.userId,
      openId: decoded.openId
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Token无效'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Token已过期'
      });
    }
    
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

/**
 * 商家认证中间件
 */
const authMerchant = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: '未提供认证令牌'
      });
    }
    
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 检查是否为商家token
    if (decoded.type !== 'merchant') {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: '无效的认证令牌'
      });
    }
    
    // 将商家信息注入到请求对象
    req.merchant = {
      merchantId: decoded.merchantId,
      account: decoded.account
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Token无效'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Token已过期'
      });
    }
    
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

/**
 * 生成用户Token
 */
const generateUserToken = (userId, openId) => {
  return jwt.sign(
    { 
      userId, 
      openId, 
      type: 'user' 
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * 生成商家Token
 */
const generateMerchantToken = (merchantId, account) => {
  return jwt.sign(
    { 
      merchantId, 
      account, 
      type: 'merchant' 
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  authUser,
  authMerchant,
  generateUserToken,
  generateMerchantToken
};
