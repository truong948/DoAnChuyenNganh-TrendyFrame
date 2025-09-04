// src/utils/frameService.js
export const FRAMES = [
  {
    alias: 'quockhanh',
    name: 'Khung Quốc Khánh',
    color: '#e11d48',
    // Thumbnail chỉ để hiển thị ngoài grid
    thumb: '/frames/khung-hinh-quockhanh.png',
    // 👉 PNG trong suốt để overlay trong Editor (đặt file vào public/frames/tet.png)
    overlay: '/frames/khung-hinh-quockhanh.png',
    used24h: 128,
    campaign: 'A80',   
  },
  {
    alias: 'khung304',
    name: 'Khung 30/04',
    color: '#dc2626',
    thumb: '/frames/kh3.png',
    overlay: '/frames/kh3.png',
    used24h: 86,
    campaign: 'A80',
  },
  {
    alias: 'trungthu',
    name: 'Khung Trung thu',
    color: '#f43f5e',
    thumb: '/frames/khung-trung-thu.png',
    overlay: '/frames/khung-trung-thu.png',
    used24h: 64,
    campaign: 'A80',
  },
  {
    alias: 'giangsinh',
    name: 'Khung Giáng sinh',
    color: '#22c55e',
    thumb: '/frames/khung-giang-sinh.png',
    overlay: '/frames/khung-giang-sinh.png',
    used24h: 44,
    campaign: 'A80',
  },

  {
    alias: 'daihoi3',
    name: 'Khung Đại hội Lần III',
    thumb: '/frames/kh1.png',
    overlay: '/frames/kh1.png',
    author: 'MARKETING VEC',
    tags: ['a80', 'daihoi', '2025'],
    featured: true
  },

  {
    alias: 'khung-phuong-tan-son-nhi',
    name: 'Khung Phương Tân Sơn Nhì',
    thumb: '/frames/kh2.png',
    overlay: '/frames/kh2.png',
    author: 'MARKETING VEC',
    tags: ['a80', 'daihoi', '2025'],
    featured: true
  }
]

// giữ nguyên các hàm
export function getFrames() { return Promise.resolve(FRAMES) }
export function getFrameByAlias(alias) { return Promise.resolve(FRAMES.find(f => f.alias === alias) || FRAMES[0]) }
export function getTrending() { return Promise.resolve([...FRAMES].sort((a, b) => b.used24h - a.used24h)) }
