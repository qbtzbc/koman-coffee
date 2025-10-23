/**
 * 用户数据模型
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 微信OpenID（唯一标识）
  openId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // 用户昵称
  nickName: {
    type: String,
    default: ''
  },
  // 用户头像URL
  avatarUrl: {
    type: String,
    default: ''
  },
  // 手机号
  phone: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

// 索引
userSchema.index({ openId: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
