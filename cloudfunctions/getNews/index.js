const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const ARTIST_KEYWORDS = ['任嘉伦', 'Allen Ren', '任国超', '佳偶天成', '陆千乔', '暮色心约', '风与潮', '37·单枪匹马', '无忧渡']

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
    ).map(word => ({
      title: word,
      summary: word,
      source: '百度热搜',
      url: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`,
      cover: '',
      category: '日常',
      time: new Date().toISOString().split('T')[0]
    }))

    return {
      success: true,
      data: artistNews,
      total: artistNews.length
    }
  } catch (err) {
    console.error('获取新闻失败:', err)
    return {
      success: false,
      data: [],
      error: err.message
    }
  }
}
