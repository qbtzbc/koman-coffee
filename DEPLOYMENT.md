# 部署指南

本文档描述了 Koman Coffee 项目的完整部署流程。

## 🌐 部署架构

```
                    ┌─────────────────┐
                    │   微信小程序    │
                    │  (顾客端/商家端)  │
                    └────────┬────────┘
                             │
                    HTTPS API 调用
                             │
                    ┌────────▼────────┐
                    │   后端服务器     │
                    │  Node.js + Express│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   MongoDB 数据库  │
                    └─────────────────┘
```

## 📋 准备工作

### 1. 服务器要求

- **操作系统**: Ubuntu 20.04+ / CentOS 7+
- **内存**: 最低 1GB，推荐 2GB+
- **CPU**: 1核+
- **存储**: 20GB+
- **网络**: 公网IP，开放 80/443 端口

### 2. 域名准备

- 准备一个域名(例如: api.koman-coffee.com)
- 配置 DNS 解析到服务器IP
- 申请 SSL 证书(小程序必须使用 HTTPS)

### 3. 微信小程序准备

- 注册微信小程序账号
- 获取 AppID 和 AppSecret
- 配置服务器域名白名单

## 🔧 服务器环境配置

### 1. 安装 Node.js

```bash
# 使用 NodeSource 安装 Node.js 16
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 2. 安装 MongoDB

```bash
# 导入公钥
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# 添加MongoDB源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# 更新包管理器并安装
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证
sudo systemctl status mongod
```

### 3. 安装 PM2 (进程管理器)

```bash
sudo npm install -g pm2
```

### 4. 安装 Nginx (可选,用于反向代理)

```bash
sudo apt-get install -y nginx
```

## 📦 部署后端服务

### 1. 上传代码

```bash
# 在服务器上创建项目目录
mkdir -p /var/www/koman-coffee
cd /var/www/koman-coffee

# 方式1: 使用 Git 克隆
git clone <your-repo-url> .

# 方式2: 使用 SCP 上传
# 在本地执行:
scp -r ./server username@your-server:/var/www/koman-coffee/
```

### 2. 安装依赖

```bash
cd /var/www/koman-coffee/server
npm install --production
```

### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

修改配置:
```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=27017
DB_NAME=koman_coffee
JWT_SECRET=your_secure_random_string_here
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

### 4. 初始化数据库

```bash
node scripts/init-data.js
```

### 5. 使用 PM2 启动服务

```bash
# 启动应用
pm2 start app.js --name koman-coffee

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs koman-coffee

# 查看状态
pm2 status
```

## 🌐 配置 Nginx 反向代理

### 1. 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/koman-coffee
```

添加配置:
```nginx
server {
    listen 80;
    server_name api.koman-coffee.com;

    # 301 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.koman-coffee.com;

    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/koman-coffee-access.log;
    error_log /var/log/nginx/koman-coffee-error.log;

    # 反向代理到 Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件
    location /uploads {
        alias /var/www/koman-coffee/server/uploads;
        expires 30d;
    }
}
```

### 2. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/koman-coffee /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 📱 部署小程序

### 1. 修改 API 配置

顾客端: `web/customer/utils/request.js`
商家端: `web/merchant/utils/request.js`

```javascript
const API_BASE_URL = 'https://api.koman-coffee.com/api';
```

### 2. 微信小程序后台配置

登录 [微信公众平台](https://mp.weixin.qq.com/)

**配置服务器域名**:
- 开发 > 开发管理 > 开发设置 > 服务器域名
- request合法域名: `https://api.koman-coffee.com`
- uploadFile合法域名: `https://api.koman-coffee.com`

### 3. 上传小程序代码

1. 打开微信开发者工具
2. 导入项目 (顾客端: `web/customer`, 商家端: `web/merchant`)
3. 点击右上角"上传"
4. 填写版本号和备注
5. 上传成功后到微信公众平台提交审核

### 4. 提交审核

- 登录微信公众平台
- 管理 > 版本管理
- 选择开发版本提交审核
- 填写测试账号等信息
- 等待审核通过后发布

## 🔒 安全加固

### 1. MongoDB 安全

```bash
# 启用认证
sudo nano /etc/mongod.conf
```

添加:
```yaml
security:
  authorization: enabled
```

创建管理员用户:
```javascript
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: [ { role: "root", db: "admin" } ]
})
```

### 2. 防火墙配置

```bash
# 安装 UFW
sudo apt-get install ufw

# 允许 SSH
sudo ufw allow 22

# 允许 HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 启用防火墙
sudo ufw enable
```

### 3. 限制MongoDB访问

```bash
# 只允许本地访问
sudo nano /etc/mongod.conf
```

确保:
```yaml
net:
  bindIp: 127.0.0.1
```

## 📊 监控与日志

### 1. PM2 监控

```bash
# 实时监控
pm2 monit

# 查看日志
pm2 logs koman-coffee --lines 100

# 日志管理
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/koman-coffee-access.log

# 错误日志
tail -f /var/log/nginx/koman-coffee-error.log
```

## 🔄 更新部署

### 自动化部署脚本

创建 `deploy.sh`:
```bash
#!/bin/bash

echo "开始部署..."

cd /var/www/koman-coffee

# 拉取最新代码
git pull origin main

# 安装依赖
cd server
npm install --production

# 重启服务
pm2 restart koman-coffee

echo "部署完成!"
```

### 手动更新

```bash
cd /var/workspace/koman-coffee
git pull
cd server
npm install --production
pm2 restart koman-coffee
```

## ⚠️ 故障排查

### 服务无法启动

```bash
# 查看PM2日志
pm2 logs koman-coffee

# 检查端口占用
lsof -i :3000

# 检查MongoDB状态
sudo systemctl status mongod
```

### MongoDB 连接失败

```bash
# 检查MongoDB是否运行
sudo systemctl status mongod

# 查看MongoDB日志
sudo tail -f /var/log/mongodb/mongod.log

# 重启MongoDB
sudo systemctl restart mongod
```

### Nginx 配置错误

```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

## 📞 技术支持

如遇到部署问题，请提交 Issue 或联系开发者。

---

**祝部署顺利！** ☕
