const api = require('../../utils/api')
const app = getApp()
const {
  getTypeInfo,
  typeClasses,
  normalizeCity,
  cityText,
  timeText,
  buildCtripFlightUrl,
  buildTrain12306Url,
  copyText
} = require('../../utils/util')

const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥'
]

Page({
  data: {
    artistName: '任嘉伦',
    events: [],
    loading: true,
    loadFailed: false,
    selectedEvent: null,
    activeEvent: null,
    cities: CITIES,
    cityIndex: 0,
    fromCity: '北京',
    showRoutes: false,
    isLocal: false,
    hasDestination: false,
    flightUrl: '',
    trainUrl: '',
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
          time: timeText(it.time),
          rawCity: it.city,
          city: cityText(it.city),
          cityKnown: Boolean(normalizeCity(it.city)),
          typeName: it.typeName || getTypeInfo(it.type).label,
          badgeClass: classes.badgeClass
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

  selectEvent(e) {
    const index = e.currentTarget.dataset.index

    if (this.data.selectedEvent === index) {
      this.setData({
        selectedEvent: null,
        activeEvent: null,
        showRoutes: false,
        isLocal: false,
        hasDestination: false
      })
      return
    }

    const activeEvent = this.data.events[index]
    const destination = normalizeCity(activeEvent.rawCity)
    const isLocal = destination !== null && destination === this.data.fromCity

    this.setData({
      selectedEvent: index,
      activeEvent,
      hasDestination: destination !== null,
      isLocal,
      showRoutes: destination !== null && !isLocal
    })

    if (destination && !isLocal) {
      this.updateRoutes()
    }
  },

  onCityChange(e) {
    const cityIndex = Number(e.detail.value)
    const fromCity = CITIES[cityIndex]
    const destination = this.data.activeEvent ? normalizeCity(this.data.activeEvent.rawCity) : null
    const isLocal = destination !== null && fromCity === destination

    this.setData({
      cityIndex,
      fromCity,
      isLocal,
      showRoutes: destination !== null && !isLocal
    })

    if (destination && !isLocal) {
      this.updateRoutes()
    }
  },

  updateRoutes() {
    const { fromCity, activeEvent } = this.data
    if (!activeEvent) return

    const destination = normalizeCity(activeEvent.rawCity)
    const date = activeEvent.date

    this.setData({
      flightUrl: buildCtripFlightUrl(fromCity, destination, date),
      trainUrl: buildTrain12306Url(fromCity, destination, date)
    })
  },

  copyRoute(e) {
    const type = e.currentTarget.dataset.type
    const url = type === 'flight' ? this.data.flightUrl : this.data.trainUrl
    if (!url) {
      wx.showToast({ title: '链接暂未生成', icon: 'none' })
      return
    }
    copyText(url, '已复制，请在浏览器打开')
  },

  onShareAppMessage() {
    return {
      title: '嘉期如梦 · 出行参考',
      path: '/pages/travel/travel'
    }
  }
})
