const app = getApp()
const { getDateInfo, getTypeInfo } = require('../../utils/util')

Page({
  data: {
    artistName: '任嘉伦',
    siteName: '嘉期如梦',
    schedule: [],
    news: [],
    loading: true,
    newsLoading: true,
    scheduleCount: 0,
    newsCount: 0,
    eventCount: 0
  },

  onLoad: function() {
    this.setData({
      artistName: app.globalData.artistName,
      siteName: app.globalData.siteName
    })
    this.getSchedule()
    this.getNews()
  },

  onPullDownRefresh: function() {
    this.getSchedule()
    this.getNews()
    wx.stopPullDownRefresh()
  },

  // 获取行程数据
  async getSchedule() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getSchedule'
      })

      const schedule = (res.result.data || []).map(item => {
        const dateInfo = getDateInfo(item.date)
        const typeInfo = getTypeInfo(item.type)
        return {
          ...item,
          day: dateInfo.day,
          month: dateInfo.month,
          dotClass: item.type === 'filming' ? 'dot-purple' : 
                    item.type === 'variety' ? 'dot-green' : 
                    item.type === 'business' ? 'dot-orange' : 'dot-pink',
          badgeClass: item.type === 'filming' ? 'badge-purple' : 
                      item.type === 'variety' ? 'badge-green' : 
                      item.type === 'business' ? 'badge-orange' : 'badge-pink'
        }
      })

      this.setData({
        schedule: schedule.slice(0, 5),
        scheduleCount: schedule.length,
        loading: false
      })
    } catch (err) {
      console.error('获取行程失败:', err)
      this.setData({ loading: false })
    }
  },

  // 获取新闻数据
  async getNews() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getNews'
      })

      const news = res.result.data || []
      this.setData({
        news: news.slice(0, 3),
        newsCount: news.length,
        newsLoading: false
      })
    } catch (err) {
      console.error('获取新闻失败:', err)
      this.setData({ newsLoading: false })
    }
  },

  goToSchedule: function() {
    wx.switchTab({
      url: '/pages/schedule/schedule'
    })
  },

  goToNews: function() {
    wx.switchTab({
      url: '/pages/news/news'
    })
  },

  goToTravel: function() {
    wx.switchTab({
      url: '/pages/travel/travel'
    })
  },

  goToScheduleDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.switchTab({
      url: '/pages/schedule/schedule'
    })
  },

  openNews: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.setClipboardData({
        data: url,
        success: () => {
          wx.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    }
  }
})
