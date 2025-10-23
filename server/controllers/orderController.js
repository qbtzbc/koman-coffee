/**
 * 订单控制器
 */
const Order = require('../models/Order');
const Product = require('../models/Product');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

/**
 * 创建订单
 * POST /api/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const { items, remark } = req.body;
  
  if (!items || items.length === 0) {
    throw new AppError('订单商品不能为空', 400, 'EMPTY_ORDER');
  }
  
  // 验证商品并计算总金额
  let totalAmount = 0;
  const orderItems = [];
  
  for (const item of items) {
    const product = await Product.findById(item.productId);
    
    if (!product) {
      throw new AppError(`商品不存在: ${item.productId}`, 404, 'PRODUCT_NOT_FOUND');
    }
    
    if (product.status !== 'active') {
      throw new AppError(`商品已下架: ${product.name}`, 400, 'PRODUCT_INACTIVE');
    }
    
    if (product.stock < item.quantity) {
      throw new AppError(`商品库存不足: ${product.name}`, 400, 'INSUFFICIENT_STOCK');
    }
    
    // 根据定制选项计算价格
    const size = item.customization?.size || 'medium';
    const price = product.price[size];
    
    orderItems.push({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0],
      quantity: item.quantity,
      price,
      customization: item.customization
    });
    
    totalAmount += price * item.quantity;
  }
  
  // 生成订单号
  const orderNo = Order.generateOrderNo();
  
  // 创建订单
  const order = await Order.create({
    orderNo,
    userId: req.user.userId,
    items: orderItems,
    totalAmount,
    status: 'pending_payment',
    remark: remark || ''
  });
  
  res.status(201).json({
    success: true,
    message: '订单创建成功',
    data: {
      orderId: order._id,
      orderNo: order.orderNo,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt
    }
  });
});

/**
 * 获取订单列表
 * GET /api/orders
 */
const getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  // 构建查询条件
  const query = {};
  
  // 区分用户和商家
  if (req.user) {
    query.userId = req.user.userId;
  }
  
  if (status) {
    query.status = status;
  }
  
  // 分页参数
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // 查询订单
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // 获取总数
  const total = await Order.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      orders
    }
  });
});

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('订单不存在', 404, 'ORDER_NOT_FOUND');
  }
  
  // 验证权限：用户只能查看自己的订单
  if (req.user && order.userId.toString() !== req.user.userId) {
    throw new AppError('无权访问此订单', 403, 'FORBIDDEN');
  }
  
  res.json({
    success: true,
    data: order
  });
});

/**
 * 支付订单（预留接口）
 * PUT /api/orders/:id/pay
 */
const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('订单不存在', 404, 'ORDER_NOT_FOUND');
  }
  
  if (order.userId.toString() !== req.user.userId) {
    throw new AppError('无权操作此订单', 403, 'FORBIDDEN');
  }
  
  if (order.status !== 'pending_payment') {
    throw new AppError('订单状态不允许支付', 400, 'INVALID_ORDER_STATUS');
  }
  
  // 使用事务处理扣减库存和更新订单状态
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 扣减商品库存
    for (const item of order.items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        throw new AppError(`商品不存在: ${item.productId}`, 404, 'PRODUCT_NOT_FOUND');
      }
      
      if (product.stock < item.quantity) {
        throw new AppError(`商品库存不足: ${product.name}`, 400, 'INSUFFICIENT_STOCK');
      }
      
      product.stock -= item.quantity;
      product.sales += item.quantity;
      await product.save({ session });
    }
    
    // 更新订单状态
    order.status = 'pending_accept';
    order.paidAt = new Date();
    await order.save({ session });
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      message: '支付成功',
      data: {
        orderId: order._id,
        status: order.status,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * 商家接单
 * PUT /api/orders/:id/accept
 */
const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('订单不存在', 404, 'ORDER_NOT_FOUND');
  }
  
  if (order.status !== 'pending_accept') {
    throw new AppError('订单状态不允许接单', 400, 'INVALID_ORDER_STATUS');
  }
  
  order.status = 'processing';
  order.acceptedAt = new Date();
  await order.save();
  
  res.json({
    success: true,
    message: '接单成功',
    data: {
      orderId: order._id,
      status: order.status,
      acceptedAt: order.acceptedAt
    }
  });
});

/**
 * 完成订单
 * PUT /api/orders/:id/complete
 */
const completeOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('订单不存在', 404, 'ORDER_NOT_FOUND');
  }
  
  if (order.status !== 'processing') {
    throw new AppError('订单状态不允许完成', 400, 'INVALID_ORDER_STATUS');
  }
  
  order.status = 'completed';
  order.completedAt = new Date();
  await order.save();
  
  res.json({
    success: true,
    message: '订单已完成',
    data: {
      orderId: order._id,
      status: order.status,
      completedAt: order.completedAt
    }
  });
});

/**
 * 取消订单
 * PUT /api/orders/:id/cancel
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('订单不存在', 404, 'ORDER_NOT_FOUND');
  }
  
  // 验证权限
  if (req.user && order.userId.toString() !== req.user.userId) {
    throw new AppError('无权操作此订单', 403, 'FORBIDDEN');
  }
  
  if (!['pending_payment', 'pending_accept'].includes(order.status)) {
    throw new AppError('订单状态不允许取消', 400, 'INVALID_ORDER_STATUS');
  }
  
  // 如果已支付，需要恢复库存
  if (order.status === 'pending_accept') {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 恢复库存
      for (const item of order.items) {
        const product = await Product.findById(item.productId).session(session);
        if (product) {
          product.stock += item.quantity;
          product.sales -= item.quantity;
          await product.save({ session });
        }
      }
      
      order.status = 'cancelled';
      order.cancelledAt = new Date();
      await order.save({ session });
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
  }
  
  res.json({
    success: true,
    message: '订单已取消',
    data: {
      orderId: order._id,
      status: order.status,
      cancelledAt: order.cancelledAt
    }
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  payOrder,
  acceptOrder,
  completeOrder,
  cancelOrder
};
