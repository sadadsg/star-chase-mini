App({
  onLaunch: function() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 替换为你的云开发环境 ID
        traceUser: true,
      })
    }
    
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.statusBarHeight = systemInfo.statusBarHeight
  },
  
  globalData: {
    userInfo: null,
    systemInfo: null,
    statusBarHeight: 0,
    artistKeywords: ['任嘉伦', 'Allen Ren', '任国超', '佳偶天成', '陆千乔', '暮色心约', '风与潮', '37·单枪匹马', '无忧渡'],
    artistName: '任嘉伦',
    siteName: '嘉期如梦',
    // 液态玻璃风格配置
    theme: {
      primary: '#C084FC',
      primaryLight: '#D8B4FE',
      primaryLighter: '#FAF5FF',
      primaryDark: '#A855F7',
      accent: '#60A5FA',
      accentLight: '#DBEAFE',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA'
    }
  }
})
