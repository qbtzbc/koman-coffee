/**
 * 统计控制器
 */
const Order = require('../models/Order');
const Product = require('../models/Product');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * 获取统计概览
 * GET /api/statistics/overview
 */
const getOverview = asyncHandler(async (req, res) => {
  const { timeRange = 'today' } = req.query;
  
  // 计算时间范围
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      startDate = weekAgo;
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  
  // 统计订单数量
  const orderCount = await Order.countDocuments({
    createdAt: { $gte: startDate },
    status: { $ne: 'cancelled' }
  });
  
  // 统计营业额（已完成订单）
  const revenueResult = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
  
  const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
  
  // 待处理订单数
  const pendingCount = await Order.countDocuments({
    status: 'pending_accept'
  });
  
  res.json({
    success: true,
    data: {
      orderCount,
      revenue,
      pendingCount,
      timeRange
    }
  });
});

/**
 * 获取销售统计
 * GET /api/statistics/sales
 */
const getSalesStatistics = asyncHandler(async (req, res) => {
  const { timeRange = 'week' } = req.query;
  
  // 计算时间范围
  const now = new Date();
  let startDate;
  let groupFormat;
  
  switch (timeRange) {
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      startDate = weekAgo;
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      break;
    default:
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      startDate = sevenDaysAgo;
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
  }
  
  // 按日期分组统计
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: groupFormat,
        orderCount: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  res.json({
    success: true,
    data: {
      timeRange,
      salesData: salesData.map(item => ({
        date: item._id,
        orderCount: item.orderCount,
        revenue: item.revenue
      }))
    }
  });
});

/**
 * 获取商品销售排行
 * GET /api/statistics/products
 */
const getProductStatistics = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  // 获取销量排行
  const topProducts = await Product.find({ status: 'active' })
    .sort({ sales: -1 })
    .limit(parseInt(limit))
    .select('name images sales category');
  
  res.json({
    success: true,
    data: {
      topProducts
    }
  });
});

module.exports = {
  getOverview,
  getSalesStatistics,
  getProductStatistics
};
