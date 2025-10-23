/**
 * 订单路由
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authUser, authMerchant } = require('../middleware/auth');

// 创建订单（需要用户认证）
router.post('/', authUser, orderController.createOrder);

// 获取订单列表（用户或商家认证）
router.get('/', (req, res, next) => {
  // 尝试用户认证
  authUser(req, res, (err) => {
    if (!err) return next();
    // 用户认证失败，尝试商家认证
    authMerchant(req, res, next);
  });
}, orderController.getOrders);

// 获取订单详情（用户或商家认证）
router.get('/:id', (req, res, next) => {
  authUser(req, res, (err) => {
    if (!err) return next();
    authMerchant(req, res, next);
  });
}, orderController.getOrderById);

// 支付订单（需要用户认证）
router.put('/:id/pay', authUser, orderController.payOrder);

// 商家接单（需要商家认证）
router.put('/:id/accept', authMerchant, orderController.acceptOrder);

// 完成订单（需要商家认证）
router.put('/:id/complete', authMerchant, orderController.completeOrder);

// 取消订单（用户或商家认证）
router.put('/:id/cancel', (req, res, next) => {
  authUser(req, res, (err) => {
    if (!err) return next();
    authMerchant(req, res, next);
  });
}, orderController.cancelOrder);

module.exports = router;
