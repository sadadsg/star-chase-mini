const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    artistName: '任嘉伦',
    news: [],
    allNews: [],
    total: 0,
    officialCount: 0,
    filter: 'all',
    loading: true,
    loadFailed: false,
    dataSourceLabel: ''
  },

  onLoad() {
    this.setData({ artistName: app.globalData.artistName })
    this.getNews()
  },

  onPullDownRefresh() {
    this.getNews()
    wx.stopPullDownRefresh()
  },

  async getNews() {
    this.setData({ loading: true })
    try {
      const res = await api.fetchNews()
      const allNews = (res.data || []).map((it, i) => Object.assign({}, it, {
        key: it.url || i,
        isOfficial: Boolean(it.official)
      }))
      this.setData({
        allNews,
        officialCount: allNews.filter(n => n.isOfficial).length,
        total: res.total || allNews.length,
        loading: false,
        loadFailed: false,
        dataSourceLabel: api.sourceLabel(res.source)
      })
      this.applyFilter()
    } catch (err) {
      console.error('获取动态失败:', err)
      this.setData({ loading: false, loadFailed: true })
    }
  },

  applyFilter() {
    const { allNews, filter } = this.data
    const news = filter === 'official'
      ? allNews.filter(n => n.isOfficial)
      : allNews
    this.setData({ news })
  },

  setFilter(e) {
    const filter = e.currentTarget.dataset.filter
    if (filter === this.data.filter) return
    this.setData({ filter })
    this.applyFilter()
  },

  refreshNews() {
    this.getNews()
  },

  copyLink(e) {
    const url = e.currentTarget.dataset.url
    if (!url) return
    wx.setClipboardData({
      data: url,
      success() {
        wx.showToast({ title: '链接已复制，可在浏览器打开', icon: 'none' })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '嘉期如梦 · 官方动态',
      path: '/pages/news/news'
    }
  }
})
