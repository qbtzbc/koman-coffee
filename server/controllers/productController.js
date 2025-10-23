/**
 * 商品控制器
 */
const Product = require('../models/Product');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * 获取商品列表
 * GET /api/products
 */
const getProducts = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10, status = 'active' } = req.query;
  
  // 构建查询条件
  const query = { status };
  if (category) {
    query.category = category;
  }
  
  // 分页参数
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // 查询商品
  const products = await Product.find(query)
    .sort({ sales: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // 获取总数
  const total = await Product.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products
    }
  });
});

/**
 * 获取商品详情
 * GET /api/products/:id
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');
  }
  
  res.json({
    success: true,
    data: product
  });
});

/**
 * 创建商品
 * POST /api/products
 */
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    images,
    price,
    stock,
    customOptions
  } = req.body;
  
  // 验证必填字段
  if (!name || !description || !category || !images || !price || stock === undefined) {
    throw new AppError('缺少必填字段', 400, 'MISSING_FIELDS');
  }
  
  // 验证价格
  if (!price.medium || !price.large) {
    throw new AppError('价格配置不完整', 400, 'INVALID_PRICE');
  }
  
  // 创建商品
  const product = await Product.create({
    name,
    description,
    category,
    images,
    price,
    stock,
    customOptions: customOptions || [],
    sales: 0,
    status: 'active'
  });
  
  res.status(201).json({
    success: true,
    message: '商品创建成功',
    data: product
  });
});

/**
 * 更新商品
 * PUT /api/products/:id
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');
  }
  
  const {
    name,
    description,
    category,
    images,
    price,
    stock,
    customOptions,
    status
  } = req.body;
  
  // 更新字段
  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (images) product.images = images;
  if (price) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (customOptions) product.customOptions = customOptions;
  if (status) product.status = status;
  
  await product.save();
  
  res.json({
    success: true,
    message: '商品更新成功',
    data: product
  });
});

/**
 * 删除商品（软删除）
 * DELETE /api/products/:id
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');
  }
  
  // 软删除：将状态设为inactive
  product.status = 'inactive';
  await product.save();
  
  res.json({
    success: true,
    message: '商品删除成功'
  });
});

/**
 * 更新库存
 * PUT /api/products/:id/stock
 */
const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  
  if (stock === undefined || stock < 0) {
    throw new AppError('库存数量无效', 400, 'INVALID_STOCK');
  }
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new AppError('商品不存在', 404, 'PRODUCT_NOT_FOUND');
  }
  
  product.stock = stock;
  await product.save();
  
  res.json({
    success: true,
    message: '库存更新成功',
    data: {
      productId: product._id,
      stock: product.stock
    }
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};
