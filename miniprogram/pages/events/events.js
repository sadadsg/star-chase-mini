const api = require('../../utils/api')
const app = getApp()
const { getTypeInfo, typeClasses, cityText, timeText } = require('../../utils/util')

Page({
  data: {
    artistName: '任嘉伦',
    events: [],
    loading: true,
    loadFailed: false,
    dataSourceLabel: ''
  },

  onLoad() {
    this.setData({ artistName: app.globalData.artistName })
    this.getEvents()
  },

  onPullDownRefresh() {
    this.getEvents()
    wx.stopPullDownRefresh()
  },

  async getEvents() {
    this.setData({ loading: true })
    try {
      const res = await api.fetchEvents()
      const events = (res.data || []).map(it => {
        const classes = typeClasses(it.type)
        return Object.assign({}, it, {
          key: it.postId || `${it.date}-${it.title}`,
          name: it.name || it.title,
          dateText: it.date ? `${it.date}${it.time && it.time !== '全天' ? ' ' + it.time : ''}` : '',
          city: cityText(it.city),
          cityKnown: Boolean(it.city && it.city !== '待定'),
          typeName: it.typeName || getTypeInfo(it.type).label,
          badgeClass: classes.badgeClass,
          dotClass: classes.dotClass
        })
      })
      this.setData({
        events,
        loading: false,
        loadFailed: false,
        dataSourceLabel: api.sourceLabel(res.source)
      })
    } catch (err) {
      console.error('获取活动失败:', err)
      this.setData({ loading: false, loadFailed: true })
    }
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
      title: '嘉期如梦 · 活动汇总',
      path: '/pages/events/events'
    }
  }
})
