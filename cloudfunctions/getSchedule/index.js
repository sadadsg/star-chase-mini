const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const ARTIST_KEYWORDS = ['任嘉伦', 'Allen Ren', '任国超', '佳偶天成', '陆千乔', '暮色心约', '风与潮', '37·单枪匹马', '无忧渡']
const SCHEDULE_KEYWORDS = {
  filming: ['开机', '杀青', '拍摄', '剧组', '新剧', '主演', '剧集'],
  variety: ['综艺', '录制', '节目', '晚会', '春晚'],
  business: ['品牌', '代言', '活动', '发布会', '时装周', '秀场', '直播'],
  fanmeeting: ['演唱会', '音乐节', '见面会', '巡演', '签售']
}
const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥', '大理', '横店', '澳门'
]

// 使用原生 https 模块获取数据
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'top.baidu.com',
      path: '/board?tab=realtime',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve(data)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.end()
  })
}

exports.main = async (event, context) => {
  try {
    const html = await fetchUrl('https://top.baidu.com/board?tab=realtime')
    
    const matches = html.match(/"word":"([^"]+)"/g) || []
    const hotWords = matches.map(m => m.replace(/"word":"/, '').replace(/"$/, ''))

    // 过滤艺人相关新闻
    const artistNews = hotWords.filter(word => 
      ARTIST_KEYWORDS.some(kw => word.includes(kw))
    )

    // 从新闻中提取行程
    const schedules = []
    let id = 10000

    for (const word of artistNews) {
      let type = null
      for (const [t, keywords] of Object.entries(SCHEDULE_KEYWORDS)) {
        if (keywords.some(kw => word.includes(kw))) {
          type = t
          break
        }
      }

      if (!type) continue

      let city = '待定'
      for (const c of CITIES) {
        if (word.includes(c)) {
          city = c
          break
        }
      }

      const typeNames = {
        filming: '影视拍摄',
        variety: '综艺录制',
        business: '商务活动',
        fanmeeting: '演出活动'
      }

      schedules.push({
        id: id++,
        date: new Date().toISOString().split('T')[0],
        type: type,
        typeName: typeNames[type] || '活动',
        title: word.slice(0, 60),
        description: word,
        location: city,
        city: city,
        time: '全天',
        newsUrl: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`
      })
    }

    return {
      success: true,
      data: schedules,
      total: schedules.length
    }
  } catch (err) {
    console.error('获取行程失败:', err)
    return {
      success: false,
      data: [],
      error: err.message
    }
  }
}
