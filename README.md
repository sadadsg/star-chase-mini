# 嘉期如梦 - 微信小程序

任嘉伦官方公开动态聚合小程序（行程日历 / 动态资讯 / 活动汇总 / 出行参考）。

数据与 [Web 版](https://github.com/sadadsg/star-chase-web) 同源：GitHub Actions 每小时从工作室官方微博镜像抓取并用 GLM 结构化抽取，产出静态 JSON。

## 架构

```
GitHub Actions（每小时）
  ├→ GitHub Pages        Web 版
  └→ 腾讯云 COS          小程序数据中转（github.io 无法加入小程序 request 白名单）
        ↓
小程序 utils/api.js 降级链：
  30min 缓存 → COS 远端 → 过期缓存 → 包内兜底数据 → 错误态
```

- `miniprogram/utils/api.js` 顶部 `REMOTE_BASE` 是唯一远端配置项（COS 桶域名）；留空则纯走包内数据
- 包内兜底数据来自 `miniprogram/data/*.js`，由同步脚本生成
- 无云开发、无服务器，包体自足

## 目录

```
star-chase-mini/
├── project.config.json        appid 等工程配置
├── miniprogram/
│   ├── app.js / app.json / app.wxss
│   ├── data/                  包内兜底数据（自动生成，勿手改）
│   ├── images/                tabBar 图标（81×81 双色态）
│   ├── pages/
│   │   ├── index/             首页：hero + 近期行程 + 宫格入口
│   │   ├── news/              动态：官方筛选 + 分类徽章 + 复制链接
│   │   ├── schedule/          行程日历：月历 + 点选日详情
│   │   ├── events/            活动门票：纯文字卡片
│   │   └── travel/            出行参考：城市匹配 + 购票链接复制
│   └── utils/
│       ├── api.js             数据层（降级链）
│       └── util.js            类型色板 / 城市归一 / 购票链接构建
├── scripts/
│   ├── sync-bundled-data.cjs  从 Web 仓同步兜底数据
│   └── gen-icons.py           重新生成 tabBar 图标
├── DESIGN.md                  设计规范 v2
└── LAUNCH.md                  上线手册（账号 / COS / 提审 / 自测）
```

## 开发

1. 微信开发者工具导入本目录（appid 见 `project.config.json`）
2. 详情 → 本地设置 → 勾选「不校验合法域名」可在开发时调试 COS 域名
3. 远端链路配置见 `LAUNCH.md` 第 2 节

## 上传前

```bash
node scripts/sync-bundled-data.cjs   # 刷新包内兜底数据
```

再在开发者工具中「上传」。

## 合规红线

- 只聚合**官方公开**内容；不做、不展示任何航班/酒店/接机等行程追踪信息
- 全部文案避免「追踪」「接机」等字样
- 外部链接一律复制后在浏览器打开（个人主体无 web-view 权限）
