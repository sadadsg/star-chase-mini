const app = getApp()
const { getTypeInfo } = require('../../utils/util')

Page({
  data: {
    artistName: '任嘉伦',
    events: [],
    loading: true
  },

  onLoad: function() {
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
          name: item.title,
          venue: item.location,
          statusText: '查看来源',
          badgeClass: 'badge-onsale',
          cover: `https://picsum.photos/seed/event${item.id}/600/400`
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
