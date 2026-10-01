const app = getApp()

Page({
  data: {
    artistName: '任嘉伦',
    news: [],
    loading: true,
    total: 0
  },

  onLoad: function() {
    this.setData({
      artistName: app.globalData.artistName
    })
    this.getNews()
  },

  onPullDownRefresh: function() {
    this.getNews()
    wx.stopPullDownRefresh()
  },

  async getNews() {
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'getNews'
      })

      this.setData({
        news: res.result.data || [],
        total: (res.result.data || []).length,
        loading: false
      })
    } catch (err) {
      console.error('获取新闻失败:', err)
      this.setData({ loading: false })
      wx.showToast({
        title: '获取新闻失败',
        icon: 'none'
      })
    }
  },

  refreshNews: function() {
    this.getNews()
    wx.showToast({
      title: '正在刷新...',
      icon: 'loading',
      duration: 1000
    })
  },

  openNews: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.setClipboardData({
        data: url,
        success: () => {
          wx.showToast({
            title: '链接已复制到剪贴板',
            icon: 'success'
          })
        }
      })
    }
  }
})
