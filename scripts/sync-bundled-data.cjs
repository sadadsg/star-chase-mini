#!/usr/bin/env node
// 把 Web 主仓的最新数据 JSON 转成小程序可 require 的 JS 模块（包内兜底数据）。
// 每次上传代码前运行一次：node scripts/sync-bundled-data.cjs
// 源目录可用环境变量覆盖：WEB_DATA_DIR=/path/to/star-chase/data node scripts/sync-bundled-data.cjs
const fs = require('fs')
const path = require('path')

const WEB_DATA_DIR = process.env.WEB_DATA_DIR || '/Users/bwsuaideyipi/star-chase/data'
const OUT_DIR = path.join(__dirname, '..', 'miniprogram', 'data')
const FILES = ['schedule', 'news', 'events']

fs.mkdirSync(OUT_DIR, { recursive: true })
let failed = false

for (const name of FILES) {
  const src = path.join(WEB_DATA_DIR, `${name}.json`)
  if (!fs.existsSync(src)) {
    console.error(`✗ 缺少 ${src}`)
    failed = true
    continue
  }
  const raw = fs.readFileSync(src, 'utf8').trim()
  try {
    JSON.parse(raw)
  } catch (e) {
    console.error(`✗ ${src} 不是合法 JSON: ${e.message}`)
    failed = true
    continue
  }
  const out = path.join(OUT_DIR, `${name}.js`)
  fs.writeFileSync(
    out,
    `// 由 scripts/sync-bundled-data.cjs 自动生成，勿手改；远端不可用时的包内兜底数据\n` +
    `// 源：star-chase/data/${name}.json\nmodule.exports = ${raw}\n`
  )
  console.log(`✓ ${name}.js (${(raw.length / 1024).toFixed(1)} KB)`)
}

process.exit(failed ? 1 : 0)
