// 统一数据层：新鲜缓存 → 远端 → 过期缓存 → 包内兜底 → 抛错（页面渲染错误态）
//
// REMOTE_BASE 是全项目唯一的远端地址配置项：
//   - 主链路：腾讯云 COS 桶域名（在 mp 后台「request 合法域名」中同步登记）
//   - 日后若有已备案域名/服务器，改这一行即可切换
//   - 置为空字符串 '' 时跳过远端请求，纯走包内数据（演示/提审兜底模式）
const REMOTE_BASE = ''

const CACHE_TTL = 30 * 60 * 1000 // 30 分钟
const REQUEST_TIMEOUT = 8000

// 小程序不支持动态 require，静态引入包内兜底数据
const BUNDLED = {
  schedule: require('../data/schedule.js'),
  news: require('../data/news.js'),
  events: require('../data/events.js'),
}

function cacheKey(name) {
  return `api_cache_${name}`
}

function readCache(name) {
  try {
    return wx.getStorageSync(cacheKey(name)) || null
  } catch (e) {
    return null
  }
}

function writeCache(name, payload) {
  try {
    wx.setStorageSync(cacheKey(name), { ts: Date.now(), payload })
  } catch (e) {
    // 存储失败不影响主流程
  }
}

function isFresh(cache) {
  return Boolean(cache && cache.payload && Date.now() - cache.ts < CACHE_TTL)
}

function fetchRemote(name) {
  return new Promise((resolve, reject) => {
    if (!REMOTE_BASE) {
      reject(new Error('remote disabled'))
      return
    }
    wx.request({
      url: `${REMOTE_BASE}/${name}.json`,
      timeout: REQUEST_TIMEOUT,
      success(res) {
        if (res.statusCode === 200 && res.data && Array.isArray(res.data.data)) {
          resolve(res.data)
        } else {
          reject(new Error(`bad response ${res.statusCode}`))
        }
      },
      fail(err) {
        reject(new Error((err && err.errMsg) || 'request fail'))
      },
    })
  })
}

async function getData(name) {
  const cache = readCache(name)
  if (isFresh(cache)) {
    return Object.assign({}, cache.payload, { source: 'cache' })
  }

  try {
    const payload = await fetchRemote(name)
    writeCache(name, payload)
    return Object.assign({}, payload, { source: 'remote' })
  } catch (err) {
    console.warn(`[api] ${name} 远端不可用:`, err && err.message)
  }

  if (cache && cache.payload) {
    return Object.assign({}, cache.payload, { source: 'cache-stale' })
  }

  const bundled = BUNDLED[name]
  if (bundled && Array.isArray(bundled.data)) {
    return Object.assign({}, bundled, { source: 'bundled' })
  }

  throw new Error(`${name} 无可用数据`)
}

const SOURCE_LABELS = {
  remote: '实时数据',
  cache: '缓存数据',
  'cache-stale': '近期缓存',
  bundled: '离线数据',
}

module.exports = {
  REMOTE_BASE,
  fetchSchedule() { return getData('schedule') },
  fetchNews() { return getData('news') },
  fetchEvents() { return getData('events') },
  sourceLabel(source) { return SOURCE_LABELS[source] || '' },
}
