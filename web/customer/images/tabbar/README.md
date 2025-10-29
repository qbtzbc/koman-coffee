# TabBar 图标资源说明

## 图标规范

### 尺寸要求
- 推荐尺寸: 81px × 81px
- 格式: PNG（支持透明背景）
- 文件大小: 单个图标不超过 40KB

### 颜色规范
- 默认状态: 深灰色 (#999999)
- 选中状态: 品牌色 (#6B4423)

## 所需图标清单

### 1. 首页图标
- `home.png` - 首页默认图标
- `home-active.png` - 首页选中图标

### 2. 订单图标
- `order.png` - 订单默认图标
- `order-active.png` - 订单选中图标

### 3. 购物车图标
- `cart.png` - 购物车默认图标
- `cart-active.png` - 购物车选中图标

### 4. 我的图标
- `user.png` - 我的默认图标
- `user-active.png` - 我的选中图标

## 临时方案

由于当前缺少设计资源，已提供两种临时解决方案：

### 方案 A: 使用 iconfont 图标库
可以从阿里巴巴 iconfont (https://www.iconfont.cn/) 下载免费图标

### 方案 B: 使用纯文本模式
修改 app.json，移除 iconPath 和 selectedIconPath 字段，仅使用文字导航

## 图标生成脚本

本目录提供了一个简单的 Node.js 脚本用于生成基础图标占位符。
请在获取正式设计资源后替换这些占位符图标。
