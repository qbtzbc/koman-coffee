/**
 * 数据库初始化脚本
 * 用于创建测试商家账号和示例商品
 */
require('dotenv').config();
const { connectDB, closeDB } = require('../config/database');
const Merchant = require('../models/Merchant');
const Product = require('../models/Product');

async function initData() {
  try {
    // 连接数据库
    await connectDB();
    console.log('开始初始化数据...');

    // 创建商家账号
    console.log('\n1. 创建测试商家账号...');
    const merchant = await Merchant.findOne({ account: 'admin' });
    if (merchant) {
      console.log('   商家账号已存在');
    } else {
      await Merchant.create({
        account: 'admin',
        password: 'admin123',
        shopName: 'Koman Coffee',
        phone: '13800138000',
        status: 'active'
      });
      console.log('   ✓ 商家账号创建成功: admin / admin123');
    }

    // 创建示例商品
    console.log('\n2. 创建示例商品...');
    const products = [
      {
        name: '美式咖啡',
        description: '经典美式咖啡，香醇浓郁',
        category: '美式',
        price: { medium: 18, large: 22 }
      },
      {
        name: '拿铁咖啡',
        description: '香浓牛奶与咖啡的完美融合',
        category: '拿铁',
        price: { medium: 22, large: 26 }
      },
      {
        name: '摩卡咖啡',
        description: '巧克力与咖啡的甜蜜邂逅',
        category: '摩卡',
        price: { medium: 24, large: 28 }
      },
      {
        name: '卡布奇诺',
        description: '浓缩咖啡配上绵密奶泡',
        category: '卡布奇诺',
        price: { medium: 20, large: 24 }
      }
    ];

    const customOptions = [
      {
        type: 'size',
        name: '容量',
        options: [
          { value: 'medium', label: '中杯', default: true },
          { value: 'large', label: '大杯' }
        ]
      },
      {
        type: 'temperature',
        name: '温度',
        options: [
          { value: 'hot', label: '热', default: true },
          { value: 'ice', label: '冰' }
        ]
      },
      {
        type: 'sugar',
        name: '糖度',
        options: [
          { value: 'none', label: '无糖' },
          { value: 'half', label: '半糖', default: true },
          { value: 'full', label: '全糖' }
        ]
      }
    ];

    for (const productData of products) {
      const exists = await Product.findOne({ name: productData.name });
      if (exists) {
        console.log(`   商品已存在: ${productData.name}`);
      } else {
        await Product.create({
          ...productData,
          images: ['https://via.placeholder.com/400'],
          stock: 100,
          sales: 0,
          customOptions,
          status: 'active'
        });
        console.log(`   ✓ 商品创建成功: ${productData.name}`);
      }
    }

    console.log('\n✅ 数据初始化完成！\n');
    console.log('商家账号: admin / admin123');
    console.log('已创建 4 个示例商品\n');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initData();
