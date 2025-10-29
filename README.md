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
- 多环境配置支持

### 后端
- Node.js 14+
- Express 4.x
- MongoDB (Mongoose)
- JWT 认证
- Bcrypt 密码加密
- 结构化日志系统
- 健康检查与监控

### 部署与运维
- Docker & Docker Compose (开发环境)
- PM2 进程管理 (生产环境)
- Nginx 反向代理
- Systemd 服务管理

## 📁 项目结构

```
koman-coffee/
├── web/                    # 小程序前端
│   ├── customer/          # 顾客端小程序
│   │   ├── pages/        # 页面
│   │   ├── components/   # 组件
│   │   ├── config/       # 环境配置
│   │   ├── images/       # 图片资源
│   │   └── utils/        # 工具函数
│   └── merchant/          # 商家端小程序
│       ├── pages/        # 页面
│       └── utils/        # 工具函数
├── server/                # 后端服务
│   ├── controllers/      # 控制器
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── middleware/      # 中间件
│   ├── config/          # 配置文件
│   │   ├── database.js  # 数据库配置（支持自动重连）
│   │   └── logger.js    # 日志系统
│   ├── logs/            # 日志文件目录
│   ├── ecosystem.config.js  # PM2 配置
│   └── Dockerfile       # Docker 镜像配置
├── deploy/                # 部署配置
│   ├── nginx/           # Nginx 配置
│   ├── systemd/         # Systemd 服务配置
│   └── scripts/         # 部署脚本
└── docker-compose.yml     # Docker Compose 配置
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 14.0.0
- MongoDB >= 4.4
- 微信开发者工具
- Docker & Docker Compose (可选，用于开发环境)
- PM2 (可选，用于生产环境)

### 方式一：使用 Docker Compose（推荐）

**一键启动开发环境**

```bash
# 从项目根目录执行
cd server
npm run docker:dev

# 或者后台运行
npm run docker:dev:bg

# 查看日志
npm run docker:logs

# 停止服务
npm run docker:stop
```

这将自动：
- 启动 MongoDB 数据库
- 启动 Node.js 后端服务
- 配置网络和数据卷
- 执行健康检查

### 方式二：传统方式安装

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
   - 环境配置已自动加载，无需手动修改
   - 开发环境：自动使用 `http://localhost:3000/api`
   - 生产环境：请在 `web/customer/config/env.prod.js` 中配置实际域名

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

## 📦 生产环境部署

### 使用 PM2 部署（推荐）

1. **安装 PM2**
```bash
npm install -g pm2
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置生产环境配置
```

3. **启动应用**
```bash
cd server
npm run pm2:start
```

4. **其他 PM2 命令**
```bash
npm run pm2:status   # 查看状态
npm run pm2:logs     # 查看日志
npm run pm2:monit    # 实时监控
npm run pm2:restart  # 重启服务
npm run pm2:stop     # 停止服务
```

5. **设置开机自启**
```bash
pm2 startup
pm2 save
```

### 使用 Nginx 反向代理

1. **安装 Nginx**
```bash
sudo apt-get install nginx  # Ubuntu/Debian
# 或
sudo yum install nginx      # CentOS/RHEL
```

2. **配置 Nginx**
```bash
sudo cp deploy/nginx/koman-coffee.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/koman-coffee.conf /etc/nginx/sites-enabled/
```

3. **修改配置**
- 编辑 `/etc/nginx/sites-available/koman-coffee.conf`
- 更改 `server_name` 为你的域名
- 配置 SSL 证书路径

4. **重启 Nginx**
```bash
sudo nginx -t                # 测试配置
sudo systemctl restart nginx # 重启服务
```

### 使用 Systemd 服务

1. **复制服务文件**
```bash
sudo cp deploy/systemd/koman-coffee.service /etc/systemd/system/
```

2. **修改配置**
- 编辑 `/etc/systemd/system/koman-coffee.service`
- 更改 `User`, `Group`, `WorkingDirectory` 等配置

3. **启动服务**
```bash
sudo systemctl daemon-reload
sudo systemctl start koman-coffee
sudo systemctl enable koman-coffee  # 开机自启
```

### 自动化部署脚本

```bash
# 运行部署脚本
cd deploy/scripts
sudo ./deploy.sh
```

该脚本将自动：
- 检查环境依赖
- 创建备份
- 拉取最新代码
- 安装依赖
- 重启应用
- 执行健康检查

## ⚙️ 系统特性

### 健康检查与监控

访问 `/health` 接口获取系统健康状态：

```bash
curl http://localhost:3000/health
```

响应示例：
```json
{
  "success": true,
  "status": "HEALTHY",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": "2h 15m 30s",
  "checks": {
    "database": {
      "status": "UP",
      "latency": "5ms"
    },
    "memory": {
      "used": "128 MB",
      "total": "512 MB",
      "percentage": 25,
      "status": "OK"
    }
  }
}
```

### 结构化日志

日志文件位于 `server/logs/` 目录：

- `application.log` - 综合日志
- `error.log` - 错误日志
- `access.log` - 访问日志

查看日志：
```bash
tail -f logs/application.log
tail -f logs/error.log
```

### 数据库自动重连

系统内置数据库自动重连机制：
- 最多重试 3 次
- 递增重试间隔：1s, 2s, 4s
- 连接失败后进入降级模式，不会直接退出

### 统一错误处理

所有 API 错误响应统一格式：

```json
{
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_abc123",
  "path": "/api/orders"
}
```

### 多环境配置

小程序自动识别运行环境：
- 开发版：使用 `config/env.dev.js`
- 体验版：使用 `config/env.test.js`
- 正式版：使用 `config/env.prod.js`

后端通过环境变量 `NODE_ENV` 区分环境。

## 📊 性能优化

### 生产环境优化建议

1. **启用 PM2 集群模式**
   - 自动利用多核 CPU
   - 已配置 2 个实例，可根据需要调整

2. **配置 Nginx 缓存**
   - 静态资源缓存 1 年
   - Gzip 压缩已启用

3. **数据库优化**
   - 为常用查询字段添加索引
   - 设置合适的连接池大小（已配置 5-10）

4. **资源限制**
   - PM2 自动重启：内存超过 500MB
   - Nginx 请求体限制：10MB

## 🔒 安全性

### 安全特性

1. **HTTPS 支持**
   - Nginx 强制 HTTPS 重定向
   - TLS 1.2/1.3 加密
   - HSTS 头支持

2. **安全响应头**
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection

3. **速率限制**
   - API 访问：100 请求/秒
   - 单 IP 连接数：20

4. **错误信息脱敏**
   - 生产环境不返回错误堆栈
   - 隐藏服务器版本信息

## 🐛 故障排查

### 常见问题

**1. 数据库连接失败**

检查 MongoDB 是否运行：
```bash
# macOS
brew services list | grep mongodb

# Linux
systemctl status mongod

# 手动启动
mongod --dbpath ./data/db
```

**2. 端口被占用**

查找占用端口的进程：
```bash
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr 3000
```

**3. PM2 启动失败**

查看 PM2 日志：
```bash
pm2 logs koman-coffee-api --err
```

**4. 小程序无法连接后端**

检查：
- 后端服务是否运行
- 小程序配置的 API 地址是否正确
- 小程序后台是否配置了服务器域名

### 日志查看

```bash
# 应用日志
tail -f server/logs/application.log

# 错误日志
tail -f server/logs/error.log

# PM2 日志
pm2 logs koman-coffee-api

# Nginx 日志
sudo tail -f /var/log/nginx/koman-coffee-error.log
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