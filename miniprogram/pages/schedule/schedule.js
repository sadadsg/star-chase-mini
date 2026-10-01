const api = require('../../utils/api')
const app = getApp()
const { getTypeInfo, typeClasses, cityText, timeText } = require('../../utils/util')

Page({
  data: {
    artistName: '任嘉伦',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    schedule: [],
    monthSchedule: [],
    calendarDays: [],
    selectedDate: null,
    selectedSchedule: [],
    stats: { filming: 0, variety: 0, business: 0, fanmeeting: 0 },
    loading: true,
    loadFailed: false,
    dataSourceLabel: ''
  },

  onLoad() {
    this.setData({ artistName: app.globalData.artistName })
    this.getSchedule()
  },

  onPullDownRefresh() {
    this.getSchedule()
    wx.stopPullDownRefresh()
  },

  async getSchedule() {
    this.setData({ loading: true })
    try {
      const res = await api.fetchSchedule()
      const schedule = (res.data || [])
        .filter(it => it.date)
        .map(it => this.decorate(it))
      this.setData({
        schedule,
        loading: false,
        loadFailed: false,
        dataSourceLabel: api.sourceLabel(res.source)
      })
      this.updateMonthSchedule()
    } catch (err) {
      console.error('获取行程失败:', err)
      this.setData({ loading: false, loadFailed: true })
    }
  },

  decorate(it) {
    const classes = typeClasses(it.type)
    return Object.assign({}, it, {
      key: it.postId || `${it.date}-${it.title}`,
      time: timeText(it.time),
      rawTime: it.time,
      isAllDay: !it.time || it.time === '全天',
      city: cityText(it.city),
      rawCity: it.city,
      typeName: it.typeName || getTypeInfo(it.type).label,
      badgeClass: classes.badgeClass,
      dotClass: classes.dotClass
    })
  },

  updateMonthSchedule() {
    const { year, month, schedule } = this.data
    const prefix = `${year}-${String(month).padStart(2, '0')}`

    const monthSchedule = schedule.filter(s => s.date && s.date.startsWith(prefix))

    const stats = { filming: 0, variety: 0, business: 0, fanmeeting: 0 }
    monthSchedule.forEach(s => {
      if (stats[s.type] !== undefined) stats[s.type]++
    })

    this.setData({ monthSchedule, stats })
    this.buildCalendar()
  },

  buildCalendar() {
    const { year, month, schedule } = this.data
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    const days = []
    let idx = 0

    for (let i = 0; i < firstDay; i++) {
      days.push({ idx: idx++, isEmpty: true })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const events = schedule.filter(s => s.date === dateStr)
      days.push({
        idx: idx++,
        day: d,
        date: dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === this.data.selectedDate,
        events
      })
    }

    this.setData({ calendarDays: days })
  },

  selectDay(e) {
    const { day, date } = e.currentTarget.dataset
    if (!day) return

    if (this.data.selectedDate === date) {
      this.setData({ selectedDate: null, selectedSchedule: [] })
      this.buildCalendar()
      return
    }

    const selectedSchedule = this.data.schedule
      .filter(s => s.date === date)
      .sort((a, b) => (a.rawTime || '').localeCompare(b.rawTime || ''))

    this.setData({ selectedDate: date, selectedSchedule })
    this.buildCalendar()
  },

  prevMonth() {
    let { year, month } = this.data
    if (month === 1) { year--; month = 12 } else { month-- }
    this.setData({ year, month, selectedDate: null, selectedSchedule: [] })
    this.updateMonthSchedule()
  },

  nextMonth() {
    let { year, month } = this.data
    if (month === 12) { year++; month = 1 } else { month++ }
    this.setData({ year, month, selectedDate: null, selectedSchedule: [] })
    this.updateMonthSchedule()
  },

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
      title: '嘉期如梦 · 行程日历',
      path: '/pages/schedule/schedule'
    }
  }
})
