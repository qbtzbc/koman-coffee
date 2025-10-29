# TabBar 图标上传指南

## 📋 图标规范

### 尺寸要求
- **推荐尺寸**: 81px × 81px
- **格式**: PNG（支持透明背景）
- **文件大小**: 单个图标不超过 40KB
- **色彩模式**: RGB

### 颜色规范
- **默认状态**: 深灰色 (#999999) 或 (#7F7F7F)
- **选中状态**: 品牌咖啡色 (#6B4423) 或 (#8B5A2B)
- **背景**: 透明（推荐）或白色

## 📁 需要上传的图标文件

请将准备好的图标文件直接放置到当前目录（`web/customer/images/tabbar/`），文件名必须严格匹配：

### ✅ 图标清单（共8个文件）

| 序号 | 文件名 | 功能 | 状态 | 建议图案 |
|------|--------|------|------|----------|
| 1 | `home.png` | 首页-默认 | ⏳ 待上传 | 房子/咖啡杯图标 |
| 2 | `home-active.png` | 首页-选中 | ⏳ 待上传 | 房子/咖啡杯图标（咖啡色） |
| 3 | `order.png` | 订单-默认 | ⏳ 待上传 | 订单列表/文档图标 |
| 4 | `order-active.png` | 订单-选中 | ⏳ 待上传 | 订单列表/文档图标（咖啡色） |
| 5 | `cart.png` | 购物车-默认 | ⏳ 待上传 | 购物车图标 |
| 6 | `cart-active.png` | 购物车-选中 | ⏳ 待上传 | 购物车图标（咖啡色） |
| 7 | `user.png` | 我的-默认 | ⏳ 待上传 | 用户/人像图标 |
| 8 | `user-active.png` | 我的-选中 | ⏳ 待上传 | 用户/人像图标（咖啡色） |

## 🎨 图标获取方式

### 方式 1: 使用 Iconfont（推荐，免费）

1. 访问 [阿里巴巴矢量图标库](https://www.iconfont.cn/)
2. 搜索关键词：
   - 首页：搜索 "home" 或 "咖啡"
   - 订单：搜索 "order" 或 "订单"
   - 购物车：搜索 "cart" 或 "购物车"
   - 我的：搜索 "user" 或 "用户"
3. 选择合适的图标，点击下载
4. 选择 PNG 格式，尺寸设置为 81px
5. 下载后重命名为对应的文件名
6. 使用图片编辑工具调整颜色（或下载两次，分别设置灰色和咖啡色）

**快速链接示例**：
- 首页图标: https://www.iconfont.cn/search/index?searchType=icon&q=home
- 订单图标: https://www.iconfont.cn/search/index?searchType=icon&q=order
- 购物车图标: https://www.iconfont.cn/search/index?searchType=icon&q=cart
- 用户图标: https://www.iconfont.cn/search/index?searchType=icon&q=user

### 方式 2: 使用 Flaticon（免费/付费）

1. 访问 [Flaticon](https://www.flaticon.com/)
2. 搜索并下载 PNG 格式图标
3. 调整尺寸和颜色

### 方式 3: 使用 IconPark（免费，字节跳动出品）

1. 访问 [IconPark](https://iconpark.oceanengine.com/)
2. 搜索并自定义颜色
3. 下载 PNG 格式

### 方式 4: 自行设计

使用 Figma、Sketch 或 Adobe Illustrator 设计图标，导出为 PNG 格式。

## 📤 上传步骤

### 第一步：准备图标文件

确保你的 8 个图标文件已准备好，文件名严格匹配上面的清单。

### 第二步：上传到项目

将 8 个 PNG 文件复制到以下目录：
```
web/customer/images/tabbar/
```

完成后，目录结构应该是：
```
web/customer/images/tabbar/
├── README.md              (本文件)
├── home.png              ← 你上传的文件
├── home-active.png       ← 你上传的文件
├── order.png             ← 你上传的文件
├── order-active.png      ← 你上传的文件
├── cart.png              ← 你上传的文件
├── cart-active.png       ← 你上传的文件
├── user.png              ← 你上传的文件
└── user-active.png       ← 你上传的文件
```

### 第三步：更新 app.json 配置

上传完成后，编辑 `web/customer/app.json` 文件，恢复图标路径配置。

找到 `tabBar` 配置部分，修改为：

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

### 第四步：在微信开发者工具中验证

1. 打开微信开发者工具
2. 编译小程序
3. 查看底部 TabBar 是否正常显示图标
4. 点击切换 Tab，检查选中状态的图标是否正确显示

## ✅ 验证清单

上传完成后，请检查以下项目：

- [ ] 8 个图标文件都已上传到正确目录
- [ ] 文件名完全匹配（包括大小写和扩展名）
- [ ] 图标尺寸符合规范（81px × 81px）
- [ ] 图标文件大小不超过 40KB
- [ ] 默认图标和选中图标颜色区分明显
- [ ] app.json 已更新图标路径
- [ ] 在微信开发者工具中编译通过
- [ ] TabBar 显示正常，图标清晰

## 🎨 图标设计建议

### 风格建议
- **简洁**: 线条清晰，避免过于复杂的细节
- **统一**: 所有图标保持相同的设计风格（线性、面性或线面结合）
- **辨识度高**: 每个图标功能明确，易于区分
- **适配性好**: 在小尺寸下依然清晰可辨

### 颜色调整技巧

如果下载的图标是单色的，可以使用以下工具调整颜色：

1. **在线工具**: [TinyPNG Color Changer](https://www.photopea.com/) (免费在线 PS)
2. **本地工具**: 
   - Windows: Paint.NET、GIMP
   - macOS: Preview（预览）、Pixelmator
   - 跨平台: GIMP、Photopea

## 🆘 常见问题

### Q1: 图标显示不出来？

**检查步骤**：
1. 确认文件已上传到 `web/customer/images/tabbar/` 目录
2. 检查文件名是否完全匹配（区分大小写）
3. 确认 app.json 中的路径是 `images/tabbar/xxx.png`
4. 在微信开发者工具中点击 "清除缓存" 后重新编译

### Q2: 图标模糊不清晰？

**解决方案**：
- 确保图标原始尺寸至少 81px × 81px
- 使用矢量图标导出，避免放大位图
- 检查图标是否为 PNG 格式（不要用 JPG）

### Q3: 图标颜色不对？

**解决方案**：
- 默认态使用灰色系（#999999 或 #7F7F7F）
- 选中态使用咖啡色（#6B4423 或 #8B5A2B）
- 使用图片编辑工具重新调色

### Q4: 我没有设计工具，怎么改颜色？

**简单方法**：
1. 从 Iconfont 下载图标时，直接设置颜色
2. 或者下载两次，分别设置为灰色和咖啡色
3. 使用在线工具 Photopea.com（免费）调整颜色

## 📞 需要帮助？

如果你在上传图标过程中遇到问题：

1. 检查本文档的常见问题部分
2. 查看项目 README.md
3. 提交 GitHub Issue

---

**当前状态**: ⏳ 等待图标上传  
**最后更新**: 2024-01-15
