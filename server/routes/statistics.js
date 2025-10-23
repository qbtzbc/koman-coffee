/**
 * 统计路由
 */
const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { authMerchant } = require('../middleware/auth');

// 获取统计概览（需要商家认证）
router.get('/overview', authMerchant, statisticsController.getOverview);

// 获取销售统计（需要商家认证）
router.get('/sales', authMerchant, statisticsController.getSalesStatistics);

// 获取商品销售排行（需要商家认证）
router.get('/products', authMerchant, statisticsController.getProductStatistics);

module.exports = router;
