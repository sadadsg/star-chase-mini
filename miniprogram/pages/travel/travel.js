const app = getApp()
const { CITIES, stationCodes, flightCodes, getTypeInfo } = require('../../utils/util')

Page({
  data: {
    artistName: '任嘉伦',
    events: [],
    loading: true,
    selectedEvent: null,
    activeEvent: null,
    cities: CITIES,
    cityIndex: 0,
    fromCity: '北京',
    showRoutes: false,
    isLocal: false,
    flightUrl: '',
    trainUrl: ''
  },

  onLoad: function(options) {
    this.setData({
      artistName: app.globalData.artistName
    })
    this.getEvents()
  },

  onPullDownRefresh: function() {
    this.getEvents()
    wx.stopPullDownRefresh()
  },

  async getEvents() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getEvents'
      })

      const events = (res.result.data || []).map(item => {
        const typeInfo = getTypeInfo(item.type)
        return {
          ...item,
          badgeClass: item.type === 'filming' ? 'badge-blue' : 
                      item.type === 'variety' ? 'badge-green' : 
                      item.type === 'business' ? 'badge-orange' : 'badge-pink'
        }
      })

      this.setData({
        events,
        loading: false
      })
    } catch (err) {
      console.error('获取活动失败:', err)
      this.setData({ loading: false })
    }
  },

  selectEvent(e) {
    const index = e.currentTarget.dataset.index
    const { selectedEvent, events, fromCity } = this.data
    
    if (selectedEvent === index) {
      this.setData({
        selectedEvent: null,
        activeEvent: null,
        showRoutes: false,
        isLocal: false
      })
      return
    }

    const activeEvent = events[index]
    const destination = activeEvent.city || activeEvent.location
    const isLocal = fromCity === destination

    this.setData({
      selectedEvent: index,
      activeEvent,
      isLocal,
      showRoutes: !isLocal
    })

    if (!isLocal) {
      this.updateRoutes()
    }
  },

  onCityChange(e) {
    const cityIndex = e.detail.value
    const fromCity = CITIES[cityIndex]
    const destination = this.data.activeEvent?.city || this.data.activeEvent?.location
    const isLocal = fromCity === destination

    this.setData({
      cityIndex,
      fromCity,
      isLocal,
      showRoutes: !isLocal
    })

    if (!isLocal) {
      this.updateRoutes()
    }
  },

  updateRoutes() {
    const { fromCity, activeEvent } = this.data
    if (!activeEvent) return

    const destination = activeEvent.city || activeEvent.location
    const date = activeEvent.date

    const fromCode = flightCodes[fromCity] || fromCity.substring(0, 2)
    const toCode = flightCodes[destination] || destination.substring(0, 2)

    this.setData({
      flightUrl: `https://flights.ctrip.com/online/list/oneway-${fromCode}-${toCode}?depdate=${date}`,
      trainUrl: `https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${stationCodes[fromCity] || ''}&leftTicketDTO.to_station=${stationCodes[destination] || ''}&purpose_codes=ADULT`
    })
  }
})
