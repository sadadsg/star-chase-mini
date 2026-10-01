App({
  onLaunch() {
    try {
      const sys = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = sys.statusBarHeight || 0
    } catch (e) {
      this.globalData.statusBarHeight = 0
    }
  },

  globalData: {
    siteName: '嘉期如梦',
    artistName: '任嘉伦',
    tagline: '官方公开动态聚合',
    statusBarHeight: 0
  }
})
