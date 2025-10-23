/**
 * 商家数据模型
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const merchantSchema = new mongoose.Schema({
  // 商家账号（唯一）
  account: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // 密码（加密存储）
  password: {
    type: String,
    required: true
  },
  // 店铺名称
  shopName: {
    type: String,
    required: true
  },
  // 联系电话
  phone: {
    type: String,
    required: true
  },
  // 状态
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// 密码加密中间件
merchantSchema.pre('save', async function(next) {
  // 只在密码被修改时才加密
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 验证密码方法
merchantSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 索引
merchantSchema.index({ account: 1 });

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
