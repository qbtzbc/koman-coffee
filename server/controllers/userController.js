/**
 * 用户控制器
 */
const User = require('../models/User');
const { generateUserToken } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const axios = require('axios');

/**
 * 用户微信登录
 * POST /api/user/login
 */
const login = asyncHandler(async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    throw new AppError('缺少登录凭证', 400, 'MISSING_CODE');
  }
  
  // 调用微信接口获取openId
  // 注意：实际环境需要配置正确的WECHAT_APP_ID和WECHAT_APP_SECRET
  const { WECHAT_APP_ID, WECHAT_APP_SECRET } = process.env;
  
  try {
    // 在开发环境中，如果没有配置微信凭证，使用模拟数据
    let openId;
    
    if (WECHAT_APP_ID && WECHAT_APP_SECRET && WECHAT_APP_ID !== 'your_wechat_app_id') {
      const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: WECHAT_APP_ID,
          secret: WECHAT_APP_SECRET,
          js_code: code,
          grant_type: 'authorization_code'
        }
      });
      
      if (wxResponse.data.errcode) {
        throw new AppError('微信登录失败', 400, 'WECHAT_LOGIN_FAILED');
      }
      
      openId = wxResponse.data.openid;
    } else {
      // 开发环境模拟openId
      openId = `mock_openid_${code}`;
    }
    
    // 查找或创建用户
    let user = await User.findOne({ openId });
    
    if (!user) {
      user = await User.create({ openId });
    }
    
    // 生成token
    const token = generateUserToken(user._id, user.openId);
    
    res.json({
      success: true,
      data: {
        token,
        userInfo: {
          userId: user._id,
          nickName: user.nickName,
          avatarUrl: user.avatarUrl
        }
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('登录失败', 500, 'LOGIN_FAILED');
  }
});

/**
 * 获取用户信息
 * GET /api/user/info
 */
const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  
  if (!user) {
    throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
  }
  
  res.json({
    success: true,
    data: {
      userId: user._id,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
      phone: user.phone
    }
  });
});

/**
 * 更新用户信息
 * PUT /api/user/info
 */
const updateUserInfo = asyncHandler(async (req, res) => {
  const { nickName, avatarUrl, phone } = req.body;
  
  const user = await User.findById(req.user.userId);
  
  if (!user) {
    throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
  }
  
  if (nickName) user.nickName = nickName;
  if (avatarUrl) user.avatarUrl = avatarUrl;
  if (phone) user.phone = phone;
  
  await user.save();
  
  res.json({
    success: true,
    message: '更新成功',
    data: {
      userId: user._id,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
      phone: user.phone
    }
  });
});

module.exports = {
  login,
  getUserInfo,
  updateUserInfo
};
