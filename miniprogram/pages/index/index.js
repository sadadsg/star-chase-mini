const api = require('../../utils/api')
const { todayStr, getDateInfo, getTypeInfo, typeClasses, cityText, timeText } = require('../../utils/util')

Page({
  data: {
    siteName: '嘉期如梦',
    artistName: '任嘉伦',
    tagline: '官方公开动态聚合',
    today: '',
    schedule: [],
    upcomingCount: 0,
    recentNote: '',
    news: [],
    newsCount: 0,
    eventsCount: 0,
    loading: true,
    newsLoading: true,
    loadFailed: false,
    dataSourceLabel: ''
  },

  onLoad() {
    this.setData({ today: this.formatToday() })
    this.loadAll()
  },

  onPullDownRefresh() {
    this.loadAll()
    wx.stopPullDownRefresh()
  },

  formatToday() {
    const info = getDateInfo(todayStr())
    return `${info.month}月${info.day}日 星期${info.weekday}`
  },

  loadAll() {
    this.loadSchedule()
    this.loadNews()
    this.loadEventsCount()
  },

  async loadSchedule() {
    this.setData({ loading: true })
    try {
      const res = await api.fetchSchedule()
      const today = todayStr()
      const all = (res.data || [])
        .filter(it => it.date)
        .map(it => this.decorate(it))
      const upcoming = all
        .filter(it => it.date >= today)
        .sort((a, b) => (a.date + (a.rawTime || '')).localeCompare(b.date + (b.rawTime || '')))
        .slice(0, 7)
      const recent = all
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3)
      this.setData({
        schedule: upcoming.length ? upcoming : recent,
        upcomingCount: upcoming.length,
        recentNote: upcoming.length ? '' : '近期暂无新行程，以下为最近收录',
        loading: false,
        loadFailed: false,
        dataSourceLabel: api.sourceLabel(res.source)
      })
    } catch (err) {
      console.error('获取行程失败:', err)
      this.setData({ loading: false, loadFailed: true, schedule: [] })
    }
  },

  decorate(it) {
    const info = getDateInfo(it.date)
    const classes = typeClasses(it.type)
    return Object.assign({}, it, {
      key: it.postId || `${it.date}-${it.title}`,
      month: info.month,
      day: info.day,
      weekday: `周${info.weekday}`,
      typeName: it.typeName || getTypeInfo(it.type).label,
      city: cityText(it.city),
      rawTime: it.time,
      time: timeText(it.time),
      isAllDay: !it.time || it.time === '全天',
      badgeClass: classes.badgeClass,
      dotClass: classes.dotClass
    })
  },

  async loadNews() {
    this.setData({ newsLoading: true })
    try {
      const res = await api.fetchNews()
      const news = (res.data || []).slice(0, 3).map((it, i) => Object.assign({}, it, {
        key: it.url || i,
        isOfficial: Boolean(it.official)
      }))
      this.setData({
        news,
        newsCount: res.total || (res.data || []).length,
        newsLoading: false
      })
    } catch (err) {
      console.error('获取动态失败:', err)
      this.setData({ newsLoading: false })
    }
  },

  async loadEventsCount() {
    try {
      const res = await api.fetchEvents()
      this.setData({ eventsCount: (res.data || []).length })
    } catch (err) {
      // 计数失败静默，不影响首页主体
    }
  },

  goToSchedule() { wx.switchTab({ url: '/pages/schedule/schedule' }) },
  goToNews() { wx.switchTab({ url: '/pages/news/news' }) },
  goToEvents() { wx.navigateTo({ url: '/pages/events/events' }) },
  goToTravel() { wx.switchTab({ url: '/pages/travel/travel' }) },

  copyLink(e) {
    const url = e.currentTarget.dataset.url
    if (!url) return
    wx.setClipboardData({
      data: url,
      success() {
        wx.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '嘉期如梦 · 任嘉伦官方公开动态',
      path: '/pages/index/index'
    }
  }
})
