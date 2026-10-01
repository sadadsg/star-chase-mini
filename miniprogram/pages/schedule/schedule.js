const app = getApp()
const { getDateInfo, getTypeInfo } = require('../../utils/util')

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
    loading: true
  },

  onLoad: function() {
    this.setData({
      artistName: app.globalData.artistName
    })
    this.getSchedule()
  },

  onPullDownRefresh: function() {
    this.getSchedule()
    wx.stopPullDownRefresh()
  },

  async getSchedule() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getSchedule'
      })

      const schedule = (res.result.data || []).map(item => {
        const typeInfo = getTypeInfo(item.type)
        return {
          ...item,
          dotClass: item.type === 'filming' ? 'dot-blue' : 
                    item.type === 'variety' ? 'dot-green' : 
                    item.type === 'business' ? 'dot-orange' : 'dot-pink',
          badgeClass: item.type === 'filming' ? 'badge-blue' : 
                      item.type === 'variety' ? 'badge-green' : 
                      item.type === 'business' ? 'badge-orange' : 'badge-pink'
        }
      })

      this.setData({ schedule, loading: false })
      this.updateMonthSchedule()
    } catch (err) {
      console.error('获取行程失败:', err)
      this.setData({ loading: false })
    }
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
    
    // 填充空白
    for (let i = 0; i < firstDay; i++) {
      days.push({ isEmpty: true })
    }
    
    // 填充日期
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const events = schedule.filter(s => s.date === dateStr)
      
      days.push({
        day: d,
        date: dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === this.data.selectedDate,
        events: events
      })
    }

    this.setData({ calendarDays: days })
  },

  selectDay(e) {
    const { day, date } = e.currentTarget.dataset
    if (!day) return

    const selectedDate = this.data.selectedDate === date ? null : date
    const selectedSchedule = selectedDate 
      ? this.data.schedule.filter(s => s.date === selectedDate)
      : []

    this.setData({ selectedDate, selectedSchedule })
    this.buildCalendar()
  },

  prevMonth() {
    let { year, month } = this.data
    if (month === 1) {
      year--
      month = 12
    } else {
      month--
    }
    this.setData({ year, month, selectedDate: null, selectedSchedule: [] })
    this.updateMonthSchedule()
  },

  nextMonth() {
    let { year, month } = this.data
    if (month === 12) {
      year++
      month = 1
    } else {
      month++
    }
    this.setData({ year, month, selectedDate: null, selectedSchedule: [] })
    this.updateMonthSchedule()
  },

  copyLink(e) {
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
