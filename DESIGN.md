# 嘉期如梦 - 设计规范 v2

对齐 Web 版 DESIGN-DOC v2.0（Apple.com 式极简），小程序端同源实现。

## 设计原则

- 白/浅灰实底分段，无玻璃拟态、无渐变、无扫光
- 发丝线分隔（1rpx #D2D2D7），大留白
- 系统字体栈，正文 28rpx，行高 1.5+
- 语义色只用于徽章/圆点等小面积点缀，正文黑白灰

## 色板（与 Web src/index.css @theme 同源）

| 令牌 | 值 | 用途 |
|---|---|---|
| --bg | #ffffff | 页面背景 |
| --surface | #f5f5f7 | 浅灰分段背景/选中态 |
| --surface-deep | #e8e8ed | 按钮态/骨架深一档 |
| --text | #1d1d1f | 主文字 |
| --text-2 | #6e6e73 | 次级文字 |
| --text-3 | #86868b | 弱化文字 |
| --hairline | #d2d2d7 | 发丝分隔线 |
| --link | #0066cc | 文本链接 |
| --btn | #0071e3 | 主按钮/选中 tab |

## 行程类型色（降饱和、白底可读）

| 类型 | 色值 | 徽章类 |
|---|---|---|
| 影视拍摄 filming | #5856d6 | .badge-filming |
| 综艺录制 variety | #248a3d | .badge-variety |
| 商务活动 business | #b45309 | .badge-business |
| 演出活动 fanmeeting | #d6336c | .badge-fanmeeting |
| 未知类型 | #6e6e73 | .badge-default |

类型色有配套 `.dot-*` 圆点类，用于月历格子与统计行。

## 结构约定

- 页面骨架：`page-header`（48rpx 大标题 + 26rpx 灰副标）→ 内容段 → `source-note` 数据来源说明
- 卡片：白底 + 发丝边框 + 20rpx 圆角（`.card`）；灰底无边框变体 `.card-tinted`
- 列表：白底通栏 + 发丝分隔（news），或卡片堆叠（schedule/events/travel）
- 官方标记：`.badge-official` 蓝描边小徽章
- 空态：emoji 图标 + 一句主文案 + 一句副文案，居中
- 首页 hero：大号「嘉期如梦」（72rpx/700）+ 日期 + 灰色副标，无图片

## tabBar

- 图标：81×81 PNG，描边风（脚本 `scripts/gen-icons.py` 生成）
- 未选中 #86868B，选中 #0071E3
- 文字：未选中 #86868B，选中 #0071E3

## 交互约定

- 外部链接：一律 `wx.setClipboardData` 复制 + toast 提示浏览器打开（个人主体无 web-view）
- 城市未知（数据管道「待定」）：统一显示「城市待定」，购票链接返回空串并渲染提示，绝不产出死链
- 下拉刷新：所有数据页支持
- 分享：所有页面 `onShareAppMessage`
- 反馈：首页底部 `button open-type="feedback"`
