// 工具函数

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

// 类型映射
const typeMap = {
  filming: { label: '影视拍摄', color: '#7C3AED', bg: 'rgba(139,92,246,0.1)' },
  variety: { label: '综艺录制', color: '#059669', bg: 'rgba(16,185,129,0.1)' },
  business: { label: '商务活动', color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
  fanmeeting: { label: '演出活动', color: '#DB2777', bg: 'rgba(236,72,153,0.1)' }
}

// 获取类型信息
function getTypeInfo(type) {
  return typeMap[type] || typeMap.business
}

// 城市列表
const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥'
]

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

module.exports = {
  formatDate,
  getDateInfo,
  getTypeInfo,
  typeMap,
  CITIES,
  stationCodes,
  flightCodes
}
