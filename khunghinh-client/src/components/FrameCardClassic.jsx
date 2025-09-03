// src/components/FrameCardClassic.jsx
import { useNavigate } from "react-router-dom"

export default function FrameCardClassic({ frame, rank, onUse }) {
  const nav = useNavigate()

  const {
    alias = "",
    name = "Khung chưa đặt tên",
    thumb,
    overlay,
    tag = "Chiến dịch",
    author = "MARKETING VEC",
    date = "2 ngày trước",
    views = 0,
  } = frame

  const src = thumb || overlay

  // màu badge xếp hạng
  const badgeColors = ["bg-yellow-400", "bg-sky-400", "bg-purple-400", "bg-blue-400"]
  const badge = badgeColors[Math.min((rank || 1) - 1, 3)] || "bg-gray-300"

  // màu tag theo loại
  const tagColors = {
    "Chiến dịch": "bg-emerald-100 text-emerald-700",
    "Sự kiện": "bg-pink-100 text-pink-600",
    "Lễ hội": "bg-sky-100 text-sky-700",
  }
  const tagClass = tagColors[tag] || "bg-gray-100 text-gray-700"

  return (
    // KHÔNG ẩn tràn ở root để badge có thể “lồi” ra ngoài
    <div className="relative overflow-visible">
      {/* Badge xếp hạng */}
      {rank && (
        <div
          className={`absolute -top-3 -left-3 z-20 h-8 w-8 rounded-full grid place-items-center text-white text-sm font-bold shadow ${badge}`}
          aria-label={`Hạng ${rank}`}
        >
          {rank}
        </div>
      )}

      {/* Thân card: KHÔNG overflow-hidden, thêm hover mượt */}
      <div className="rounded-[20px] bg-white shadow-md ring-1 ring-gray-200 flex flex-col transform-gpu transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        {/* Ảnh: chỉ phần này ẩn tràn */}
        <div className="px-6 pt-6">
          <div className="rounded-[16px] overflow-hidden ring-1 ring-gray-200 bg-white">
            {/* Tỉ lệ vuông, không méo ảnh */}
            <div className="aspect-square">
              <img
                src={src}
                alt={name}
                className="w-full h-full object-contain p-2 block transition-transform duration-300 will-change-transform"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Tiêu đề + tag */}
        <div className="px-6 pt-4">
          <h3 className="text-base font-semibold leading-snug line-clamp-2 text-gray-900">
            {name}
          </h3>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tagClass}`}>
              {tag}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6">
          <div className="h-px w-full bg-gray-200 my-4" />
        </div>

        {/* Meta */}
        <div className="px-6 pb-2 text-sm">
          <div className="flex items-center gap-2 text-gray-800">
            <span className="h-7 w-7 rounded-full bg-gray-200 grid place-items-center text-[11px] font-bold text-gray-700">
              {(author || "M")[0]}
            </span>
            <span className="font-medium">{author}</span>
          </div>
          <div className="mt-2 space-y-2 text-gray-500 text-[13px]">
            <div className="flex items-center gap-2">
              <span>🕒</span>
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👁</span>
              <span>{Intl.NumberFormat("vi-VN").format(views)}</span>
            </div>
          </div>
        </div>

        {/* Nút */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={() => {
              window.scrollTo(0, 0)                   // 👈 cuộn lên đầu ngay khi bấm
              if (onUse) {
                onUse(frame)
              } else {
                nav(`/editor?alias=${alias}`)        // rồi mới điều hướng sang Editor
              }
            }}
            className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition active:scale-[.98] shadow-sm"
          >
            Thử khung này
          </button>
        </div>
      </div>
    </div>
  )
}
