# TabBar 图标上传快速指南

## 📍 当前位置

你现在看到的目录是：
```
web/customer/images/tabbar/
```

## ✅ 需要做什么

你需要在这个目录中上传 **8 个 PNG 图标文件**，文件名必须严格匹配：

### 必需的 8 个文件

| 序号 | 文件名 | 说明 | 颜色 |
|------|--------|------|------|
| 1 | `home.png` | 首页-默认 | 灰色 #999999 |
| 2 | `home-active.png` | 首页-选中 | 咖啡色 #6B4423 |
| 3 | `order.png` | 订单-默认 | 灰色 #999999 |
| 4 | `order-active.png` | 订单-选中 | 咖啡色 #6B4423 |
| 5 | `cart.png` | 购物车-默认 | 灰色 #999999 |
| 6 | `cart-active.png` | 购物车-选中 | 咖啡色 #6B4423 |
| 7 | `user.png` | 我的-默认 | 灰色 #999999 |
| 8 | `user-active.png` | 我的-选中 | 咖啡色 #6B4423 |

## 🚀 三步完成上传

### 第一步：获取图标

**最快方法** - 从 Iconfont 下载（2分钟）：

1. 打开浏览器，访问：https://www.iconfont.cn/
2. 搜索 "home"，找一个喜欢的房子图标
3. 点击下载，选择：
   - 格式：PNG
   - 尺寸：81px
   - 颜色：#999999（灰色）
4. 下载后重命名为 `home.png`
5. 再次下载同一个图标，颜色改为 #6B4423（咖啡色）
6. 重命名为 `home-active.png`
7. 重复以上步骤，搜索并下载：
   - "order" 或 "订单" → order.png & order-active.png
   - "cart" 或 "购物车" → cart.png & cart-active.png
   - "user" 或 "用户" → user.png & user-active.png

### 第二步：上传文件

将下载好的 8 个 PNG 文件直接放到这个目录：
```
web/customer/images/tabbar/
```

**上传后的目录结构应该是**：
```
web/customer/images/tabbar/
├── README.md
├── UPLOAD_GUIDE.md (本文件)
├── home.png              ← 你上传的文件
├── home-active.png       ← 你上传的文件
├── order.png             ← 你上传的文件
├── order-active.png      ← 你上传的文件
├── cart.png              ← 你上传的文件
├── cart-active.png       ← 你上传的文件
├── user.png              ← 你上传的文件
└── user-active.png       ← 你上传的文件
```

### 第三步：更新配置

上传完成后，编辑 `web/customer/app.json` 文件，找到 `tabBar` 部分，修改为：

```json
"tabBar": {
  "color": "#999999",
  "selectedColor": "#6B4423",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/tabbar/home.png",
      "selectedIconPath": "images/tabbar/home-active.png"
    },
    {
      "pagePath": "pages/order/order",
      "text": "订单",
      "iconPath": "images/tabbar/order.png",
      "selectedIconPath": "images/tabbar/order-active.png"
    },
    {
      "pagePath": "pages/cart/cart",
      "text": "购物车",
      "iconPath": "images/tabbar/cart.png",
      "selectedIconPath": "images/tabbar/cart-active.png"
    },
    {
      "pagePath": "pages/profile/profile",
      "text": "我的",
      "iconPath": "images/tabbar/user.png",
      "selectedIconPath": "images/tabbar/user-active.png"
    }
  ]
}
```

## ✅ 完成验证

1. 打开微信开发者工具
2. 编译小程序
3. 查看底部 TabBar 是否显示图标
4. 点击切换不同 Tab，检查选中状态的图标是否正确

## 🎨 懒人方案

如果你暂时没有时间找图标，可以：

1. **暂时使用纯文本模式**（当前状态）
   - TabBar 只显示文字，没有图标
   - 不影响功能使用

2. **稍后再添加图标**
   - 按照上面的步骤，准备好图标后随时上传
   - 上传后立即生效

## 📦 推荐图标组合

### 方案一：简约线性风格
- **来源**：Iconfont
- **关键词**：home-line, order-line, cart-line, user-line
- **特点**：统一的线性风格，简洁清晰

### 方案二：圆润面性风格  
- **来源**：Iconfont
- **关键词**：home-fill, order-fill, cart-fill, user-fill
- **特点**：可爱圆润，识别度高

### 方案三：咖啡主题风格
- **home**: 咖啡杯图标
- **order**: 咖啡豆/订单图标
- **cart**: 购物车图标
- **user**: 用户图标

## ❓ 常见问题

**Q: 我不会改图标颜色怎么办？**
A: 在 Iconfont 下载时直接选择颜色，下载两次即可（一次灰色，一次咖啡色）

**Q: 图标尺寸不对怎么办？**
A: 在 Iconfont 下载时选择 81px，或使用在线工具 https://www.photopea.com/ 调整尺寸

**Q: 上传后图标不显示？**
A: 检查文件名是否完全匹配（包括大小写和扩展名 .png）

**Q: 我可以用其他格式吗？**
A: 不可以，必须是 PNG 格式（微信小程序要求）

## 🔗 有用的链接

- Iconfont 图标库: https://www.iconfont.cn/
- Flaticon 图标库: https://www.flaticon.com/
- IconPark 图标库: https://iconpark.oceanengine.com/
- 在线图片编辑器: https://www.photopea.com/

---

**需要帮助？** 查看 `README.md` 获取更详细的说明，或查看占位符文件 `PLACEHOLDER_*.txt` 了解每个图标的具体要求。

**当前状态**: ⏳ 等待上传图标文件
