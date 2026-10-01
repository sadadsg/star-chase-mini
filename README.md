# 嘉期如梦 - 微信小程序

任嘉伦粉丝站微信小程序版本

## ✨ 设计风格

### 液态玻璃风格
- **主色调**：薰衣草紫 (#C084FC)
- **辅助色**：天蓝 (#60A5FA)
- **背景色**：薰衣草渐变
- **设计元素**：半透明卡片、大圆角、柔和渐变

### 设计特点
- 与 Web 版统一的视觉标准
- 清新梦幻的色彩搭配
- 液态玻璃质感卡片
- 符合追星人审美偏好

## 📁 项目结构

```
star-chase-mini/
├── cloudfunctions/           # 云函数
│   ├── getNews/             # 获取新闻
│   ├── getSchedule/         # 获取行程
│   └── getEvents/           # 获取活动
├── miniprogram/             # 小程序代码
│   ├── pages/
│   │   ├── index/          # 首页
│   │   ├── news/           # 新闻资讯
│   │   ├── schedule/       # 行程日历
│   │   ├── events/         # 活动门票
│   │   └── travel/         # 出行推荐
│   ├── utils/
│   │   └── util.js         # 工具函数
│   ├── images/             # 图片资源
│   ├── app.js              # 全局逻辑
│   ├── app.json            # 全局配置
│   └── app.wxss            # 全局样式
└── project.config.json     # 项目配置
```

## 🎨 设计系统

### 色彩令牌

```css
/* 主色调 */
--primary: #C084FC;        /* 薰衣草紫 */
--primary-light: #D8B4FE;  /* 浅紫 */
--primary-lighter: #FAF5FF; /* 淡紫 */

/* 辅助色 */
--accent: #60A5FA;         /* 天蓝 */
--accent-light: #DBEAFE;   /* 浅蓝 */

/* 功能色 */
--success: #34D399;        /* 清新绿 */
--warning: #FBBF24;        /* 温暖橙 */
--info: #60A5FA;           /* 天空蓝 */
```

### 圆角系统

```css
--radius-sm: 12rpx;   /* 小圆角 */
--radius-md: 20rpx;   /* 中圆角 */
--radius-lg: 28rpx;   /* 大圆角 */
--radius-xl: 36rpx;   /* 超大圆角 */
--radius-full: 999rpx; /* 全圆角 */
```

### 阴影系统

```css
--shadow-sm: 0 4rpx 12rpx rgba(155, 143, 232, 0.08);
--shadow-md: 0 8rpx 24rpx rgba(155, 143, 232, 0.12);
--shadow-lg: 0 16rpx 48rpx rgba(155, 143, 232, 0.16);
```

## 🚀 快速开始

### 1. 注册小程序账号

1. 访问 https://mp.weixin.qq.com
2. 注册小程序账号（个人即可）
3. 获取 AppID

### 2. 下载开发工具

下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 3. 创建项目

1. 打开微信开发者工具
2. 选择「新建项目」
3. 填写 AppID
4. 选择「微信云开发」
5. 点击「确定」

### 4. 开通云开发

1. 点击开发者工具顶部的「云开发」按钮
2. 开通云开发服务
3. 创建环境（免费额度足够）
4. 记录环境 ID

### 5. 修改配置

修改 `miniprogram/app.js` 中的云开发环境 ID：

```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云开发环境 ID
  traceUser: true,
})
```

### 6. 部署云函数

1. 右键点击 `cloudfunctions/getNews`
2. 选择「上传并部署：云端安装依赖」
3. 对 `getSchedule` 和 `getEvents` 重复同样操作

### 7. 测试运行

1. 点击「编译」按钮
2. 检查各页面是否正常
3. 检查云函数是否正常调用

## 📱 页面说明

### 首页
- Hero Banner 展示
- 统计卡片（行程/新闻/活动数量）
- 近期行程列表
- 最新资讯列表
- 出行推荐入口

### 新闻资讯
- 实时获取百度热搜
- 过滤艺人相关新闻
- 点击可复制链接
- 液态玻璃卡片设计

### 行程日历
- 日历视图显示行程
- 支持按月查看
- 点击日期查看详情
- 梦幻紫色主题

### 活动门票
- 显示活动列表
- 支持查看来源
- 精致卡片设计

### 出行推荐
- 选择活动
- 选择出发城市
- 生成出行方案
- 清新步骤引导

## 🔧 后期维护

### 更新代码

1. 修改代码
2. 重新上传云函数
3. 重新上传小程序
4. 提交审核

### 查看数据

1. 登录微信公众平台
2. 查看云开发控制台
3. 查看调用次数和错误日志

### 如果 API 挂了

1. 检查云函数日志
2. 更新云函数代码
3. 重新部署

## 💰 费用说明

| 项目 | 免费额度 | 超出费用 |
|------|---------|---------|
| 云函数 | 100万次/月 | 0.01元/次 |
| 数据库 | 2GB | 0.1元/GB |
| 存储 | 5GB | 0.1元/GB |

**预计月费用：0元**

## 📚 学习资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 🆘 常见问题

### Q1: 云函数调用失败？
A: 检查云开发环境是否正确，云函数是否部署成功

### Q2: 小程序白屏？
A: 检查 app.json 配置是否正确，页面路径是否正确

### Q3: 审核不通过？
A: 检查是否违反小程序规范，内容是否合规

## 🎯 设计亮点

1. **梦幻紫色主题**：符合追星人审美
2. **星星装饰元素**：增加浪漫氛围
3. **柔和渐变效果**：提升视觉层次
4. **圆润卡片设计**：营造温馨感
5. **精致微交互**：增强用户体验

## 📄 许可证

MIT License
