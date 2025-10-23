# 快速启动指南

本指南帮助你在 5 分钟内快速运行 Koman Coffee 项目。

## 🚀 第一步: 安装依赖

### 1. 确保已安装

- Node.js (>= 14.0.0)
- MongoDB (>= 4.4)
- 微信开发者工具

### 2. 安装后端依赖

```bash
cd server
npm install
```

## ⚙️ 第二步: 配置环境

### 1. 复制环境变量文件

```bash
cd server
cp .env.example .env
```

### 2. 编辑 .env 文件 (使用默认配置即可)

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=27017
DB_NAME=koman_coffee
JWT_SECRET=koman_coffee_secret_2024
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

## 💾 第三步: 启动数据库

```bash
# 启动 MongoDB (根据你的安装方式)
mongod

# 或使用系统服务
sudo systemctl start mongod
```

## 🎬 第四步: 初始化数据

```bash
cd server
npm run init
```

这将创建:
- 测试商家账号: `admin` / `admin123`
- 4 个示例咖啡商品

## 🔥 第五步: 启动后端服务

```bash
cd server

# 开发模式(热重载)
npm run dev

# 或生产模式
npm start
```

看到以下信息表示启动成功:
```
╔════════════════════════════════════════╗
║   Koman Coffee API Server Started     ║
╠════════════════════════════════════════╣
║   Port: 3000                           ║
║   Environment: development             ║
╚════════════════════════════════════════╝

MongoDB 连接成功: mongodb://localhost:27017/koman_coffee
```

## 📱 第六步: 运行小程序

### 顾客端

1. 打开微信开发者工具
2. 导入项目,选择目录: `web/customer`
3. AppID 选择"测试号"
4. 点击"编译"运行

### 商家端

1. 打开微信开发者工具
2. 导入项目,选择目录: `web/merchant`
3. AppID 选择"测试号"
4. 点击"编译"运行
5. 使用账号登录: `admin` / `admin123`

## ✅ 验证安装

### 1. 测试后端 API

打开浏览器访问:
```
http://localhost:3000/health
```

应该看到:
```json
{
  "success": true,
  "message": "Koman Coffee API is running",
  "timestamp": "2024-..."
}
```

### 2. 测试商品列表

```
http://localhost:3000/api/products
```

应该看到返回的商品数据。

## 🎯 开始使用

### 顾客端体验流程

1. 启动顾客端小程序
2. 浏览商品列表
3. 点击商品查看详情
4. 选择定制选项(容量、温度、糖度)
5. 加入购物车
6. 进入购物车页面
7. 点击结算创建订单
8. 模拟支付
9. 查看订单详情

### 商家端操作流程

1. 启动商家端小程序
2. 使用 `admin` / `admin123` 登录
3. 查看首页统计数据
4. 进入订单管理查看待处理订单
5. 点击"接单"处理订单
6. 完成制作后点击"完成订单"
7. 在商品管理添加新商品
8. 查看统计数据

## 🔧 常见问题

### Q: MongoDB 连接失败?

A: 确保 MongoDB 已启动:
```bash
sudo systemctl status mongod
# 如果未启动
sudo systemctl start mongod
```

### Q: 端口 3000 已被占用?

A: 修改 `.env` 文件中的 `PORT` 为其他端口,如 3001。

### Q: 小程序请求失败?

A: 
1. 检查后端服务是否正常运行
2. 确认 `utils/request.js` 中的 API_BASE_URL 配置正确
3. 微信开发者工具中勾选"不校验合法域名"

### Q: 商家登录失败?

A: 确保已运行数据初始化脚本:
```bash
cd server
npm run init
```

## 📚 下一步

- 阅读 [README.md](./README.md) 了解详细功能
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 学习部署
- 浏览设计文档了解架构

## 💡 开发建议

### 修改 API 地址

在小程序 `utils/request.js` 中修改:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### 热重载开发

使用 `npm run dev` 启动后端,代码修改后自动重启。

### 调试技巧

- 后端日志: 查看终端输出
- 小程序日志: 开发者工具 Console 面板
- 网络请求: 开发者工具 Network 面板

## 🎉 开始你的咖啡之旅!

现在你已经成功启动了项目,可以开始探索和开发了。祝你编码愉快! ☕

---

**遇到问题?** 查看完整文档或提交 Issue。
