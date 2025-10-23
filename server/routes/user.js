/**
 * 用户路由
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authUser } = require('../middleware/auth');

// 用户登录（无需认证）
router.post('/login', userController.login);

// 获取用户信息（需要认证）
router.get('/info', authUser, userController.getUserInfo);

// 更新用户信息（需要认证）
router.put('/info', authUser, userController.updateUserInfo);

module.exports = router;
