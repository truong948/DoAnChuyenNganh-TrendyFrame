// src/utils/frameService.js
export const FRAMES = [
  {
    alias: 'tet',
    name: 'Khung Tết 2025',
    color: '#e11d48',
    // Thumbnail chỉ để hiển thị ngoài grid
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2s7dFw-at04C4xO5r8hOPGc-R9TqE47wdQw&s',
    // 👉 PNG trong suốt để overlay trong Editor (đặt file vào public/frames/tet.png)
    overlay: '/frames/khung-hinh-tet.png',
    used24h: 128,
  },
  {
    alias: 'vn',
    name: 'Quốc khánh',
    color: '#dc2626',
    thumb: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&q=60',
    overlay: '/frames/vn.png',
    used24h: 86,
  },
  {
    alias: 'love',
    name: 'Tình yêu',
    color: '#f43f5e',
    thumb: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=60',
    overlay: '/frames/love.png',
    used24h: 64,
  },
  {
    alias: 'noel',
    name: 'Giáng sinh',
    color: '#22c55e',
    thumb: 'https://khunghinh.net/editor/465103e8-5f63-4f68-8e46-ba621f91eab5',
    overlay: '/frames/noel.png',
    used24h: 44,
  },
  {
    alias: 'tech',
    name: 'Công nghệ',
    color: '#2563eb',
    thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=60',
    overlay: '/frames/tech.png',
    used24h: 30,
  },
]

// giữ nguyên các hàm
export function getFrames() { return Promise.resolve(FRAMES) }
export function getFrameByAlias(alias) { return Promise.resolve(FRAMES.find(f => f.alias === alias) || FRAMES[0]) }
export function getTrending() { return Promise.resolve([...FRAMES].sort((a, b) => b.used24h - a.used24h)) }
