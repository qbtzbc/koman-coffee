/**
 * 订单数据模型
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 订单号（唯一）
  orderNo: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // 用户ID
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // 订单商品列表
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    customization: {
      size: {
        type: String,
        enum: ['medium', 'large']
      },
      temperature: {
        type: String,
        enum: ['hot', 'ice']
      },
      sugar: {
        type: String,
        enum: ['none', 'half', 'full']
      }
    }
  }],
  // 订单总金额
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // 订单状态
  status: {
    type: String,
    enum: ['pending_payment', 'pending_accept', 'processing', 'completed', 'cancelled'],
    default: 'pending_payment',
    index: true
  },
  // 订单备注
  remark: {
    type: String,
    default: ''
  },
  // 支付时间
  paidAt: {
    type: Date
  },
  // 接单时间
  acceptedAt: {
    type: Date
  },
  // 完成时间
  completedAt: {
    type: Date
  },
  // 取消时间
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 索引
orderSchema.index({ orderNo: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 }); // 创建时间降序索引

// 生成订单号的静态方法
orderSchema.statics.generateOrderNo = function() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}${random}`;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
