// src/pages/Home.jsx
import { Image as ImgIcon, ScissorsSquare, ImageDown } from 'lucide-react'
import FrameGrid from '../components/FrameGrid'
import FrameCardClassic from '../components/FrameCardClassic'   // <= dùng card classic
import { useEffect, useMemo, useState } from 'react'
import { getFrames } from '../utils/frameService'
import { useNavigate } from 'react-router-dom'

/* ===== NỀN XANH KIỂU CUBE ===== */
function BlueCubesBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200" />
      <div className="absolute -top-16 left-1/4 h-[320px] w-[320px] rounded-full bg-sky-300/30 blur-3xl animate-float" />
      <div className="absolute bottom-[-120px] right-1/5 h-[380px] w-[380px] rounded-full bg-sky-400/25 blur-3xl animate-float-slow" />
      <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 1440 700">
        <defs>
          <linearGradient id="cube" x1="0" x2="1">
            <stop stopColor="#8DD6FF" stopOpacity=".35" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity=".25" />
          </linearGradient>
        </defs>
        {[
          { x: 80, y: 110, w: 80, h: 80, d: 9 },
          { x: 220, y: 240, w: 120, h: 120, d: 11 },
          { x: 420, y: 150, w: 90, h: 90, d: 10 },
          { x: 620, y: 90, w: 70, h: 70, d: 8 },
          { x: 730, y: 260, w: 180, h: 180, d: 13 },
          { x: 980, y: 80, w: 140, h: 140, d: 12 },
          { x: 1160, y: 220, w: 90, h: 90, d: 10 },
          { x: 340, y: 360, w: 70, h: 70, d: 8 },
          { x: 520, y: 410, w: 160, h: 160, d: 12 },
          { x: 840, y: 340, w: 110, h: 110, d: 11 },
        ].map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="10" fill="url(#cube)" stroke="#fff" strokeOpacity=".35" />
            <path d={`M ${c.x} ${c.y} l ${c.d} -${c.d} h ${c.w} l -${c.d} ${c.d} z`} fill="#ffffff" opacity=".12" />
            <rect x={c.x} y={c.y + c.h} width={c.w} height="6" fill="#60A5FA" opacity=".12" />
          </g>
        ))}
      </svg>
    </div>
  )
}
/* ===== HẾT NỀN ===== */

export default function Home() {
  const [frames, setFrames] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    getFrames().then(setFrames)
  }, [])

  // Top 4 khung nổi bật (ưu tiên used24h)
  const featuredFrames = useMemo(() => {
    if (!frames?.length) return []
    const scored = frames.map(f => ({
      ...f,
      _score: (f.used24h || f.views24h || 0) + (f.featured ? 100 : 0),
    }))
    return scored.sort((a, b) => b._score - a._score).slice(0, 4)
  }, [frames])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200">
        <BlueCubesBackground />
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6 py-16">
          {/* Cột trái */}
          <div className="max-w-xl">
            <p className="text-blue-600 font-semibold mb-3">Nơi khung hình được chia sẻ</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Tạo <span className="relative inline-block">
                <span className="relative z-10 font-extrabold italic text-gray-900">khung hình</span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-blue-300/60 -z-0" />
                <span className="absolute -left-3 -top-2 h-3 w-3 border-t-4 border-l-4 border-blue-600 rounded-sm" />
                <span className="absolute -right-3 -top-2 h-3 w-3 border-t-4 border-r-4 border-blue-600 rounded-sm" />
              </span>
              <br />online – nhanh, đẹp và tiện lợi với mọi người
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Cung cấp các công cụ hình ảnh để tạo khung hình và chia sẻ thông điệp về chiến dịch, sự kiện, hoạt động… đến mọi người.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="/editor" className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">TẠO NGAY</a>
              <a href="/trending" className="px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-semibold hover:bg-gray-50 transition">XU HƯỚNG</a>
            </div>
          </div>

          {/* Cột phải (demo grid) */}
          <div className="relative">
            <div className="absolute inset-0 rounded-l-[80px] bg-blue-200/60" />
            <div className="relative z-10 grid grid-cols-2 gap-4 p-6">
              {[
                '/frames/sample-1.jpg',
                '/frames/sample-2.jpg',
                '/frames/sample-3.jpg',
                '/frames/sample-4.jpg',
                '/frames/sample-5.jpg',
                '/frames/sample-6.jpg',
              ].map((src, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <img src={src} alt={`frame-${i}`} className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Các công cụ tiện lợi</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'Nén ảnh', d: 'Giảm dung lượng ảnh dễ dàng', icon: <ImageDown /> },
            { t: 'Cắt / Xoá nền', d: 'Loại bỏ nền, cắt ảnh nhanh', icon: <ScissorsSquare /> },
            { t: 'Tạo avatar', d: 'Khung ảnh đại diện theo mẫu', icon: <ImgIcon /> },
          ].map((it, i) => (
            <div key={i} className="card p-6 tilt">
              <div className="text-blue-600">{it.icon}</div>
              <h3 className="font-semibold mt-2 mb-1">{it.t}</h3>
              <p className="text-sm text-gray-600">{it.d}</p>
              <button className="btn-primary mt-4">Thử ngay</button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured – dùng card classic nhỏ gọn, nút cam */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-blue-600 font-semibold">Xu hướng</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Các khung hình nổi bật</h2>
            <p className="text-sm text-gray-600 mt-1">
              Danh sách khung hình nhận được nhiều tương tác nhất trong 24 giờ qua.
            </p>
          </div>
          <button className="pill" onClick={() => nav('/trending')}>Xem thêm</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFrames.map((f, idx) => (
            <FrameCardClassic
              key={f.alias}
              frame={{
                ...f,
                tag: f.tag || 'Chiến dịch',
                author: f.author || 'MARKETING VEC',
                date: f.date || '2 ngày trước',
              }}
              rank={idx + 1}
              theme="blue"                        // nút cam giống mẫu
              onUse={() => nav(`/editor?alias=${f.alias}`)}
            />
          ))}
        </div>
      </section>

      {/* Templates (danh sách đầy đủ) */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Thử ngay mẫu thiết kế</h2>
            <button className="pill" onClick={() => nav('/trending')}>Xem tất cả</button>
          </div>
          <FrameGrid frames={frames} onUse={(f) => nav(`/editor?alias=${f.alias}`)} />
        </div>
      </section>

      {/* Follow */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="card p-6 text-center">
          <div className="text-gray-700 font-semibold mb-2">Theo dõi chúng tôi để nhận mẫu mới hằng ngày</div>
          <div className="flex justify-center gap-3">
            <a className="pill" href="#">Facebook Page</a>
            <a className="pill" href="#">Facebook Group</a>
          </div>
        </div>
      </section>
    </div>
  )
}
