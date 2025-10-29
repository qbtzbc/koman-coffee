#!/usr/bin/env node

/**
 * TabBar 图标生成脚本
 * 使用 Canvas 生成简单的 PNG 图标
 */

const fs = require('fs');
const { createCanvas } = require('canvas');

const SIZE = 81;
const GRAY_COLOR = '#999999';
const ACTIVE_COLOR = '#6B4423';

// 图标配置
const icons = [
  {
    name: 'home',
    draw: (ctx, color) => {
      // 画一个简单的房子/咖啡杯图标
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      
      // 咖啡杯身
      ctx.beginPath();
      ctx.moveTo(25, 35);
      ctx.lineTo(20, 65);
      ctx.lineTo(61, 65);
      ctx.lineTo(56, 35);
      ctx.closePath();
      ctx.stroke();
      
      // 咖啡杯口
      ctx.beginPath();
      ctx.moveTo(20, 35);
      ctx.lineTo(61, 35);
      ctx.stroke();
      
      // 热气
      ctx.beginPath();
      ctx.arc(30, 25, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(40, 20, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(50, 25, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    name: 'order',
    draw: (ctx, color) => {
      // 画一个简单的订单列表图标
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      
      // 外框
      ctx.strokeRect(25, 20, 31, 41);
      
      // 列表线条
      ctx.beginPath();
      ctx.moveTo(30, 30);
      ctx.lineTo(51, 30);
      ctx.moveTo(30, 40);
      ctx.lineTo(51, 40);
      ctx.moveTo(30, 50);
      ctx.lineTo(51, 50);
      ctx.stroke();
    }
  },
  {
    name: 'cart',
    draw: (ctx, color) => {
      // 画一个简单的购物车图标
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      
      // 购物车框
      ctx.beginPath();
      ctx.moveTo(25, 25);
      ctx.lineTo(30, 50);
      ctx.lineTo(55, 50);
      ctx.lineTo(58, 30);
      ctx.lineTo(35, 30);
      ctx.stroke();
      
      // 轮子
      ctx.beginPath();
      ctx.arc(35, 60, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(50, 60, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    name: 'user',
    draw: (ctx, color) => {
      // 画一个简单的用户图标
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      
      // 头部
      ctx.beginPath();
      ctx.arc(40, 30, 10, 0, Math.PI * 2);
      ctx.stroke();
      
      // 身体
      ctx.beginPath();
      ctx.arc(40, 55, 15, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(25, 55);
      ctx.lineTo(25, 65);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(55, 55);
      ctx.lineTo(55, 65);
      ctx.stroke();
    }
  }
];

// 检查是否安装了 canvas 模块
try {
  require.resolve('canvas');
} catch (e) {
  console.log('未安装 canvas 模块。');
  console.log('请运行: npm install canvas');
  console.log('');
  console.log('由于生成PNG图标需要依赖，建议：');
  console.log('1. 从 Iconfont (https://www.iconfont.cn/) 下载图标');
  console.log('2. 参考 README.md 和 UPLOAD_GUIDE.md 手动上传图标');
  process.exit(1);
}

// 生成图标
function generateIcon(iconConfig, color, filename) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  
  // 透明背景
  ctx.clearRect(0, 0, SIZE, SIZE);
  
  // 绘制图标
  iconConfig.draw(ctx, color);
  
  // 保存文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`✓ 生成: ${filename}`);
}

// 生成所有图标
console.log('开始生成 TabBar 图标...\n');

icons.forEach(icon => {
  // 默认状态（灰色）
  generateIcon(icon, GRAY_COLOR, `${icon.name}.png`);
  
  // 选中状态（咖啡色）
  generateIcon(icon, ACTIVE_COLOR, `${icon.name}-active.png`);
});

console.log('\n图标生成完成！共生成 8 个文件。');
console.log('\n请在微信开发者工具中查看效果。');
console.log('如需更精美的图标，请参考 README.md 从 Iconfont 下载。');
