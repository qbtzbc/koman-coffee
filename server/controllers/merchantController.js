/**
 * 商家控制器
 */
const Merchant = require('../models/Merchant');
const { generateMerchantToken } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * 商家登录
 * POST /api/merchant/login
 */
const login = asyncHandler(async (req, res) => {
  const { account, password } = req.body;
  
  if (!account || !password) {
    throw new AppError('账号和密码不能为空', 400, 'MISSING_CREDENTIALS');
  }
  
  // 查找商家
  const merchant = await Merchant.findOne({ account });
  
  if (!merchant) {
    throw new AppError('账号或密码错误', 401, 'INVALID_CREDENTIALS');
  }
  
  // 验证密码
  const isPasswordValid = await merchant.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new AppError('账号或密码错误', 401, 'INVALID_CREDENTIALS');
  }
  
  // 检查商家状态
  if (merchant.status !== 'active') {
    throw new AppError('账号已被禁用', 403, 'ACCOUNT_DISABLED');
  }
  
  // 生成token
  const token = generateMerchantToken(merchant._id, merchant.account);
  
  res.json({
    success: true,
    data: {
      token,
      merchantInfo: {
        merchantId: merchant._id,
        account: merchant.account,
        shopName: merchant.shopName,
        phone: merchant.phone
      }
    }
  });
});

/**
 * 获取商家信息
 * GET /api/merchant/info
 */
const getMerchantInfo = asyncHandler(async (req, res) => {
  const merchant = await Merchant.findById(req.merchant.merchantId).select('-password');
  
  if (!merchant) {
    throw new AppError('商家不存在', 404, 'MERCHANT_NOT_FOUND');
  }
  
  res.json({
    success: true,
    data: {
      merchantId: merchant._id,
      account: merchant.account,
      shopName: merchant.shopName,
      phone: merchant.phone,
      status: merchant.status
    }
  });
});

/**
 * 更新商家信息
 * PUT /api/merchant/info
 */
const updateMerchantInfo = asyncHandler(async (req, res) => {
  const { shopName, phone } = req.body;
  
  const merchant = await Merchant.findById(req.merchant.merchantId);
  
  if (!merchant) {
    throw new AppError('商家不存在', 404, 'MERCHANT_NOT_FOUND');
  }
  
  if (shopName) merchant.shopName = shopName;
  if (phone) merchant.phone = phone;
  
  await merchant.save();
  
  res.json({
    success: true,
    message: '更新成功',
    data: {
      merchantId: merchant._id,
      account: merchant.account,
      shopName: merchant.shopName,
      phone: merchant.phone
    }
  });
});

module.exports = {
  login,
  getMerchantInfo,
  updateMerchantInfo
};
