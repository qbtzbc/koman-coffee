/**
 * 商品路由
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMerchant } = require('../middleware/auth');

// 获取商品列表（无需认证）
router.get('/', productController.getProducts);

// 获取商品详情（无需认证）
router.get('/:id', productController.getProductById);

// 创建商品（需要商家认证）
router.post('/', authMerchant, productController.createProduct);

// 更新商品（需要商家认证）
router.put('/:id', authMerchant, productController.updateProduct);

// 删除商品（需要商家认证）
router.delete('/:id', authMerchant, productController.deleteProduct);

// 更新库存（需要商家认证）
router.put('/:id/stock', authMerchant, productController.updateStock);

module.exports = router;
