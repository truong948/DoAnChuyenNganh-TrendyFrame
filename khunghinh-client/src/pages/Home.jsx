// src/pages/Home.jsx
import { Image as ImgIcon, ScissorsSquare, ImageDown } from 'lucide-react'
import FrameGrid from '../components/FrameGrid'
import FrameCardClassic from '../components/FrameCardClassic'
import { useEffect, useMemo, useState } from 'react'
import { getFrames } from '../utils/frameService'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MotionCard, MotionStagger, fadeUp } from '../components/Anim'
import { Play } from "lucide-react";

/* ===== NỀN XANH KIỂU CUBE (nâng cấp) ===== */
function BlueCubesBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* lớp gradient nền mềm hơn */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200" />

      {/* vệt sáng mềm */}
      <div className="absolute -top-24 left-1/4 h-[340px] w-[340px] rounded-full bg-sky-300/30 blur-3xl animate-float" />
      <div className="absolute bottom-[-140px] right-[18%] h-[420px] w-[420px] rounded-full bg-sky-400/25 blur-3xl animate-float-slow" />

      {/* pattern cube */}
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
            <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="12" fill="url(#cube)" stroke="#fff" strokeOpacity=".35" />
            <path d={`M ${c.x} ${c.y} l ${c.d} -${c.d} h ${c.w} l -${c.d} ${c.d} z`} fill="#ffffff" opacity=".10" />
            <rect x={c.x} y={c.y + c.h} width={c.w} height="6" fill="#60A5FA" opacity=".10" />
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
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <BlueCubesBackground />
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6 py-20">
          {/* Cột trái */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium ring-1 ring-blue-200/60 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Nơi khung hình được chia sẻ
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Tạo{' '}
              <span className="relative inline-block px-1">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 italic">
                  khung hình
                </span>
                {/* gạch nhấn */}
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-blue-300/50 rounded-sm -z-0" />
                <span className="absolute -left-3 -top-2 h-3 w-3 border-t-4 border-l-4 border-blue-600/90 rounded-sm" />
                <span className="absolute -right-3 -top-2 h-3 w-3 border-t-4 border-r-4 border-blue-600/90 rounded-sm" />
              </span>
              <br />
              online – nhanh, đẹp và tiện lợi
            </h1>

            <p className="mt-4 text-gray-700 text-lg">
              Cung cấp các công cụ để tạo khung hình và lan toả thông điệp cho chiến dịch, sự kiện, hoạt động… đến mọi người.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/editor"
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:translate-y-[1px] shadow-lg shadow-blue-600/20 ring-1 ring-blue-700/50 btn-breathe"
              >
                TẠO NGAY
              </a>
              <a
                href="/trending"
                className="px-6 py-3 rounded-xl font-semibold text-gray-800 ring-1 ring-gray-300/70 hover:bg-white transition"
              >
                XU HƯỚNG
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TOOLS ============ */}
      <section className="relative">
        {/* radial background rất nhẹ để tách section */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.12),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Các công cụ tiện lợi</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Nén ảnh', d: 'Giảm dung lượng ảnh dễ dàng', icon: <ImageDown className="w-6 h-6" /> },
              { t: 'Cắt / Xoá nền', d: 'Loại bỏ nền, cắt ảnh nhanh', icon: <ScissorsSquare className="w-6 h-6" /> },
              { t: 'Tạo avatar', d: 'Khung ảnh đại diện theo mẫu', icon: <ImgIcon className="w-6 h-6" /> },
            ].map((it, i) => (
              <MotionCard i={i} key={i}>
                <div className="group rounded-2xl p-6 bg-white/80 ring-1 ring-gray-200 hover:ring-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(59,130,246,.25)] shine hover-lift">
                  <div className="inline-grid place-items-center w-10 h-10 rounded-xl bg-blue-50 ring-1 ring-blue-200/60 text-blue-700">
                    {it.icon}
                  </div>
                  <h3 className="font-semibold mt-3 mb-1">{it.t}</h3>
                  <p className="text-sm text-gray-600">{it.d}</p>
                  <button className="mt-4 px-4 py-2 rounded-lg text-blue-700 font-medium ring-1 ring-blue-200 hover:bg-blue-50">
                    Thử ngay
                  </button>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-blue-600 font-semibold">Xu hướng</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Các khung hình nổi bật</h2>
            <p className="text-sm text-gray-600 mt-1">
              Danh sách khung hình nhận được nhiều tương tác nhất trong 24 giờ qua.
            </p>
          </motion.div>

          <motion.button
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="px-4 py-2 rounded-xl font-semibold text-gray-800 ring-1 ring-gray-300/70 hover:bg-white hover-lift"
            onClick={() => nav('/trending')}
          >
            Xem thêm
          </motion.button>
        </div>

        <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFrames.map((f, idx) => (
            <MotionCard i={idx} key={f.alias} className="h-full">
              {/* KHÔNG dùng .shine cũ, dùng .shine-safe và KHÔNG đặt overflow-hidden ở đây */}
              <div className="shine-safe hover-lift transform-gpu">
                <FrameCardClassic
                  frame={{
                    ...f,
                    tag: f.tag || 'Chiến dịch',
                    author: f.author || 'MARKETING VEC',
                    date: f.date || '2 ngày trước',
                  }}
                  rank={idx + 1}
                  theme="blue"
                  onUse={() => nav(`/editor?alias=${f.alias}`)}
                />
              </div>
            </MotionCard>
          ))}
        </MotionStagger>

      </section>

      {/* ============ TEMPLATES ============ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-gray-50" />
        <div aria-hidden className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Thử ngay mẫu thiết kế</h2>
            <button className="px-4 py-2 rounded-xl font-semibold text-gray-800 ring-1 ring-gray-300/70 hover:bg-white" onClick={() => nav('/trending')}>
              Xem tất cả
            </button>
          </div>
          <FrameGrid frames={frames} onUse={(f) => nav(`/editor?alias=${f.alias}`)} />
        </div>
      </section>

      {/* ============ FOLLOW ============ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-6 text-center bg-white/80 ring-1 ring-gray-200 shadow-[0_10px_40px_-12px_rgba(0,0,0,.08)]">
          <div className="text-gray-700 font-semibold mb-2">Theo dõi chúng tôi để nhận mẫu mới hằng ngày</div>
          <div className="flex justify-center gap-3">
            <a className="px-4 py-2 rounded-xl font-medium text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50" href="#">
              Facebook Page
            </a>
            <a className="px-4 py-2 rounded-xl font-medium text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50" href="#">
              Facebook Group
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
