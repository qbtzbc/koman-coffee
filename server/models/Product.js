/**
 * 商品数据模型
 */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // 商品名称
  name: {
    type: String,
    required: true
  },
  // 商品描述
  description: {
    type: String,
    required: true
  },
  // 商品分类
  category: {
    type: String,
    required: true,
    index: true
  },
  // 商品图片URL数组
  images: [{
    type: String,
    required: true
  }],
  // 价格配置
  price: {
    medium: {
      type: Number,
      required: true,
      min: 0
    },
    large: {
      type: Number,
      required: true,
      min: 0
    }
  },
  // 库存数量
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // 销量
  sales: {
    type: Number,
    default: 0,
    min: 0
  },
  // 定制选项配置
  customOptions: [{
    type: {
      type: String,
      enum: ['size', 'temperature', 'sugar'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    options: [{
      value: String,
      label: String,
      default: Boolean
    }]
  }],
  // 状态
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

// 索引
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ sales: -1 }); // 销量降序索引，用于热销排行

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
