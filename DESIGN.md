# 嘉期如梦 - 设计规范

## 设计理念

### 目标用户
追星人群（任嘉伦粉丝），偏好：
- 清新梦幻的视觉风格
- 液态玻璃质感
- 精致细腻的细节处理
- 有呼吸感的布局

### 设计关键词
- 液态玻璃（Liquid Glass）
- 薰衣草紫
- 大圆角
- 半透明卡片
- 渐变背景

## 色彩系统

### 主色调

| 名称 | 色值 | 用途 |
|------|------|------|
| 薰衣草紫 | #C084FC | 主按钮、导航栏、重点元素 |
| 浅紫 | #D8B4FE | 次要元素、图标 |
| 淡紫 | #FAF5FF | 背景、卡片 |

### 辅助色

| 名称 | 色值 | 用途 |
|------|------|------|
| 天蓝 | #60A5FA | 强调、装饰 |
| 浅蓝 | #DBEAFE | 背景、徽章 |

### 功能色

| 名称 | 色值 | 用途 |
|------|------|------|
| 清新绿 | #34D399 | 成功、确认 |
| 温暖橙 | #FBBF24 | 警告、提示 |
| 天空蓝 | #60A5FA | 信息、链接 |

### 中性色

| 名称 | 色值 | 用途 |
|------|------|------|
| 主要文字 | #1E1B4B | 标题、正文 |
| 次要文字 | #4B5563 | 说明、描述 |
| 辅助文字 | #9CA3AF | 时间、来源 |
| 页面背景 | 渐变 | 整体背景 |
| 卡片背景 | rgba(255,255,255,0.6) | 卡片、弹窗 |

## 间距系统

```css
--space-xs: 8rpx;   /* 4px */
--space-sm: 16rpx;  /* 8px */
--space-md: 24rpx;  /* 12px */
--space-lg: 32rpx;  /* 16px */
--space-xl: 48rpx;  /* 24px */
```

## 圆角系统

```css
--radius-sm: 12rpx;   /* 小按钮、标签 */
--radius-md: 20rpx;   /* 输入框 */
--radius-lg: 28rpx;   /* 大卡片 */
--radius-xl: 36rpx;   /* 主卡片、弹窗 */
--radius-full: 999rpx; /* 胶囊按钮 */
```

## 阴影系统

```css
--shadow-sm: 0 4rpx 16rpx rgba(139, 92, 246, 0.06);
--shadow-md: 0 8rpx 32rpx rgba(139, 92, 246, 0.08);
--shadow-lg: 0 16rpx 48rpx rgba(139, 92, 246, 0.1);
```

## 组件规范

### 卡片（液态玻璃）
```css
.card {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 36rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 16rpx rgba(139, 92, 246, 0.06);
}
```

### 按钮
```css
.btn-primary {
  background: linear-gradient(135deg, #C084FC, #A855F7);
  border-radius: 36rpx;
  box-shadow: 0 8rpx 24rpx rgba(168, 85, 247, 0.3);
}
```

### 徽章
```css
.badge {
  border-radius: 28rpx;
  font-weight: 500;
}
.badge-purple { background: rgba(168, 85, 247, 0.1); color: #A855F7; }
.badge-pink { background: rgba(236, 72, 153, 0.1); color: #EC4899; }
.badge-green { background: rgba(16, 185, 129, 0.1); color: #34D399; }
.badge-orange { background: rgba(245, 158, 11, 0.1); color: #FBBF24; }
```

## 动画效果

- **fadeInUp**: 淡入上移（0.5s）
- **scaleIn**: 缩放弹入（0.3s）
- **shimmer**: 骨架屏闪烁（1.5s）
- **twinkle**: 星星闪烁（2s）

## 与 Web 版统一

- 相同的薰衣草紫主色调
- 相同的圆角系统（28-36rpx）
- 相同的中性色体系
- 相同的渐变背景风格
