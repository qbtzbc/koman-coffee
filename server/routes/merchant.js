/**
 * 商家路由
 */
const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { authMerchant } = require('../middleware/auth');

// 商家登录（无需认证）
router.post('/login', merchantController.login);

// 获取商家信息（需要认证）
router.get('/info', authMerchant, merchantController.getMerchantInfo);

// 更新商家信息（需要认证）
router.put('/info', authMerchant, merchantController.updateMerchantInfo);

module.exports = router;
