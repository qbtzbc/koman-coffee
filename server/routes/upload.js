/**
 * 文件上传路由
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMerchant } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('只允许上传 JPG、JPEG、PNG 格式的图片', 400, 'INVALID_FILE_TYPE'));
  }
};

// 创建multer实例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 2097152 // 默认2MB
  }
});

/**
 * 上传单张图片
 * POST /api/upload/image
 */
router.post('/image', authMerchant, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      code: 'NO_FILE',
      message: '请选择要上传的文件'
    });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  
  res.json({
    success: true,
    message: '图片上传成功',
    data: {
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    }
  });
});

/**
 * 上传多张图片
 * POST /api/upload/images
 */
router.post('/images', authMerchant, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      code: 'NO_FILES',
      message: '请选择要上传的文件'
    });
  }
  
  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  
  res.json({
    success: true,
    message: '图片上传成功',
    data: {
      urls: imageUrls,
      count: req.files.length
    }
  });
});

module.exports = router;
