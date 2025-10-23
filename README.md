# Koman Coffee - 微信小程序咖啡点单系统

一个基于微信原生小程序开发的咖啡点单系统,提供顾客端和商家端双端功能。

## 📋 项目简介

本项目是一个完整的咖啡店点单解决方案,包含:
- **顾客端小程序**: 浏览商品、定制咖啡、下单支付、查看订单
- **商家端小程序**: 订单管理、商品管理、数据统计
- **后端服务**: Node.js + Express + MongoDB,提供完整的 RESTful API

## 🚀 技术栈

### 前端
- 微信原生小程序 (WXML、WXSS、JavaScript)
- 组件化开发
- 本地存储管理

### 后端
- Node.js 14+
- Express 4.x
- MongoDB (Mongoose)
- JWT 认证
- Bcrypt 密码加密

## 📁 项目结构

```
koman-coffee/
├── web/                    # 小程序前端
│   ├── customer/          # 顾客端小程序
│   │   ├── pages/        # 页面
│   │   ├── components/   # 组件
│   │   └── utils/        # 工具函数
│   └── merchant/          # 商家端小程序
│       ├── pages/        # 页面
│       └── utils/        # 工具函数
└── server/                # 后端服务
    ├── controllers/      # 控制器
    ├── models/          # 数据模型
    ├── routes/          # 路由
    ├── middleware/      # 中间件
    └── config/          # 配置文件
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 14.0.0
- MongoDB >= 4.4
- 微信开发者工具

### 后端服务安装

1. 进入服务目录
```bash
cd server
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件,配置数据库连接等信息:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=27017
DB_NAME=koman_coffee
JWT_SECRET=your_secret_key
```

4. 启动 MongoDB 数据库
```bash
mongod
```

5. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务将在 http://localhost:3000 启动

### 小程序配置

1. 使用微信开发者工具打开项目
   - 顾客端: `web/customer`
   - 商家端: `web/merchant`

2. 修改 API 地址
   - 编辑 `utils/request.js` 中的 `API_BASE_URL`
   - 开发环境: `http://localhost:3000/api`
   - 生产环境: 修改为实际服务器地址

3. 配置小程序 AppID (在微信公众平台获取)

4. 编译并运行

## 💾 数据库初始化

### 创建测试商家账号

可以使用以下脚本创建测试商家账号:

```javascript
// 在 MongoDB shell 或使用 Node.js 脚本
const Merchant = require('./server/models/Merchant');

Merchant.create({
  account: 'admin',
  password: 'admin123',  // 会自动加密
  shopName: 'Koman Coffee',
  phone: '13800138000',
  status: 'active'
});
```

### 创建测试商品

```javascript
const Product = require('./server/models/Product');

Product.create({
  name: '美式咖啡',
  description: '经典美式咖啡,香醇浓郁',
  category: '美式',
  images: ['https://via.placeholder.com/400'],
  price: { medium: 18, large: 22 },
  stock: 100,
  sales: 0,
  customOptions: [
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
  ],
  status: 'active'
});
```

## 🔑 核心功能

### 顾客端

- ✅ 商品浏览与分类筛选
- ✅ 商品详情与定制选项
- ✅ 购物车管理
- ✅ 订单创建与支付(模拟)
- ✅ 订单列表与详情
- ✅ 用户登录(微信授权)

### 商家端

- ✅ 商家登录认证
- ✅ 订单管理(接单、完成)
- ✅ 商品管理(增删改查)
- ✅ 数据统计(订单、营业额)

### 后端 API

- ✅ 用户认证与授权
- ✅ 商品 CRUD 操作
- ✅ 订单流程管理
- ✅ 库存管理
- ✅ 数据统计分析

## 📱 使用说明

### 顾客端使用流程

1. 打开顾客端小程序
2. 浏览商品列表,选择心仪的咖啡
3. 进入商品详情,选择定制选项(容量、温度、糖度)
4. 加入购物车或立即购买
5. 在购物车确认订单
6. 点击结算创建订单
7. 模拟支付后等待商家接单
8. 在订单列表查看订单状态

### 商家端使用流程

1. 使用商家账号登录
2. 在首页查看今日数据概览
3. 进入订单管理,查看待处理订单
4. 点击接单,开始制作
5. 完成制作后点击完成订单
6. 在商品管理添加/编辑商品
7. 查看统计数据分析经营情况

## 🔐 API 接口文档

### 用户相关

- `POST /api/user/login` - 用户登录
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/info` - 更新用户信息

### 商家相关

- `POST /api/merchant/login` - 商家登录
- `GET /api/merchant/info` - 获取商家信息

### 商品相关

- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取商品详情
- `POST /api/products` - 创建商品(商家)
- `PUT /api/products/:id` - 更新商品(商家)
- `DELETE /api/products/:id` - 删除商品(商家)

### 订单相关

- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `PUT /api/orders/:id/pay` - 支付订单
- `PUT /api/orders/:id/accept` - 商家接单
- `PUT /api/orders/:id/complete` - 完成订单
- `PUT /api/orders/:id/cancel` - 取消订单

### 统计相关

- `GET /api/statistics/overview` - 统计概览
- `GET /api/statistics/sales` - 销售统计
- `GET /api/statistics/products` - 商品销售排行

## 🧪 测试

### 运行测试

```bash
cd server
npm test
```

### 测试账号

- 商家账号: `admin` / `admin123`

## 📝 开发规范

### 代码风格

- 使用 ES6+ 语法
- 组件和函数使用驼峰命名
- 文件名使用 kebab-case
- 添加必要的注释

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具变动
```

## 🔮 后续规划

- [ ] 接入微信支付
- [ ] 优惠券系统
- [ ] 会员积分
- [ ] 外卖配送
- [ ] 图片 CDN
- [ ] 数据缓存优化
- [ ] 单元测试覆盖

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request!

## 📧 联系方式

如有问题,请提交 Issue 或联系开发者。

---

**注意**: 本项目仅供学习交流使用,商用请遵守相关法律法规。