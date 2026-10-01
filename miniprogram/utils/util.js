// 工具函数

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 今天的 YYYY-MM-DD
function todayStr() {
  return formatDate(new Date())
}

// 获取日期信息
function getDateInfo(dateStr) {
  const d = new Date(dateStr)
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
    monthStr: String(d.getMonth() + 1).padStart(2, '0'),
    dayStr: String(d.getDate()).padStart(2, '0')
  }
}

// 行程类型映射（色板与 Web DESIGN-DOC v2.0 同源：降饱和、白底可读）
const typeMap = {
  filming: { label: '影视拍摄', color: '#5856d6', bg: 'rgba(88,86,214,0.10)' },
  variety: { label: '综艺录制', color: '#248a3d', bg: 'rgba(36,138,61,0.10)' },
  business: { label: '商务活动', color: '#b45309', bg: 'rgba(180,83,9,0.10)' },
  fanmeeting: { label: '演出活动', color: '#d6336c', bg: 'rgba(214,51,108,0.10)' }
}

// 获取类型信息；未知类型按「公开动态」灰档处理，不强行归为商务
function getTypeInfo(type) {
  return typeMap[type] || { label: '公开动态', color: '#6e6e73', bg: 'rgba(110,110,115,0.10)' }
}

// 徽章/圆点样式类（wxss 中定义 .badge-filming 等四档 + .badge-default）
function typeClasses(type) {
  const known = ['filming', 'variety', 'business', 'fanmeeting']
  const t = known.indexOf(type) >= 0 ? type : 'default'
  return { badgeClass: `badge-${t}`, dotClass: `dot-${t}` }
}

// 城市归一化：与 Web src/lib/travel-links.js 同源。数据管道用「待定」表示城市未知
function normalizeCity(city) {
  if (typeof city !== 'string') return null
  const trimmed = city.trim()
  if (!trimmed || trimmed === '待定') return null
  return trimmed
}

function cityText(city) {
  return normalizeCity(city) || '城市待定'
}

// 时刻展示：空值统一为「全天」
function timeText(time) {
  return (time && time !== '全天') ? time : '全天'
}

// 城市 → 12306 车站代码
const stationCodes = {
  '北京': 'BJP', '上海': 'SHH', '广州': 'GZQ', '深圳': 'SZQ',
  '成都': 'CDW', '杭州': 'HZH', '南京': 'NJH', '武汉': 'WHN',
  '重庆': 'CQW', '西安': 'XAY', '长沙': 'CSQ', '天津': 'TJP',
  '苏州': 'SZH', '青岛': 'QDK', '大连': 'DLT', '郑州': 'ZZF',
  '昆明': 'KMM', '厦门': 'XMS', '福州': 'FZS', '合肥': 'HFH'
}

// 城市 → 携程三字码
const flightCodes = {
  '北京': 'BJS', '上海': 'SHA', '广州': 'CAN', '深圳': 'SZX',
  '成都': 'CTU', '杭州': 'HGH', '南京': 'NKG', '武汉': 'WUH',
  '重庆': 'CKG', '西安': 'SIA', '长沙': 'CSX', '天津': 'TSN',
  '苏州': 'SZV', '青岛': 'TAO', '大连': 'DLC', '郑州': 'CGO',
  '昆明': 'KMG', '厦门': 'XMN', '福州': 'FOC', '合肥': 'HFE'
}

// 携程机票链接：两端城市缺码或日期缺失时返回 ''（不产出死链）
function buildCtripFlightUrl(from, to, date) {
  const f = flightCodes[normalizeCity(from)]
  const t = flightCodes[normalizeCity(to)]
  if (!f || !t || !date) return ''
  return `https://flights.ctrip.com/online/list/oneway-${f}-${t}?depdate=${date}`
}

// 12306 车次链接：两端缺站码或日期缺失时返回 ''
function buildTrain12306Url(from, to, date) {
  const f = stationCodes[normalizeCity(from)]
  const t = stationCodes[normalizeCity(to)]
  if (!f || !t || !date) return ''
  return `https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${date}` +
    `&leftTicketDTO.from_station=${f}&leftTicketDTO.to_station=${t}&purpose_codes=ADULT`
}

// 复制文本 + 成功提示
function copyText(text, toastTitle) {
  if (!text) return
  wx.setClipboardData({
    data: text,
    success() {
      wx.showToast({ title: toastTitle || '已复制', icon: 'success' })
    }
  })
}

module.exports = {
  formatDate,
  todayStr,
  getDateInfo,
  getTypeInfo,
  typeClasses,
  typeMap,
  normalizeCity,
  cityText,
  timeText,
  stationCodes,
  flightCodes,
  buildCtripFlightUrl,
  buildTrain12306Url,
  copyText
}
