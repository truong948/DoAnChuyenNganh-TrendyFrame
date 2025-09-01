// src/utils/frameService.js
export const FRAMES = [
  {
    alias: 'qk',
    name: 'Khung Quốc Khánh',
    color: '#e11d48',
    // Thumbnail chỉ để hiển thị ngoài grid
    thumb: '/frames/khung-hinh-quoc-khanh.png',
    // 👉 PNG trong suốt để overlay trong Editor (đặt file vào public/frames/tet.png)
    overlay: '/frames/khung-hinh-quoc-khanh.png',
    used24h: 128,
  },
  {
    alias: 'vn',
    name: 'Tình yêu',
    color: '#dc2626',
    thumb: '/frames/khung-hinh-tinh-yeu.png',
    overlay: '/frames/khung-hinh-tinh-yeu.png',
    used24h: 86,
  },
  {
    alias: 'love',
    name: 'Mùa thu',
    color: '#f43f5e',
    thumb: '/frames/khung-hinh-mua-thu.png',
    overlay: '/frames/khung-hinh-mua-thu.png',
    used24h: 64,
  },
  {
    alias: 'noel',
    name: 'Giáng sinh',
    color: '#22c55e',
    thumb: '/frames/khung-hinh-giang-sinh.png',
    overlay: '/frames/khung-hinh-giang-sinh.png',
    used24h: 44,
  },
  {
    alias: 'tet',
    name: 'Khung Tết 2025',
    color: '#2563eb',
    thumb: '/frames/khung-hinh-tet.png',
    overlay: '/frames/khung-hinh-tet.png',
    used24h: 30,
  },
]

// giữ nguyên các hàm
export function getFrames() { return Promise.resolve(FRAMES) }
export function getFrameByAlias(alias) { return Promise.resolve(FRAMES.find(f => f.alias === alias) || FRAMES[0]) }
export function getTrending() { return Promise.resolve([...FRAMES].sort((a, b) => b.used24h - a.used24h)) }
