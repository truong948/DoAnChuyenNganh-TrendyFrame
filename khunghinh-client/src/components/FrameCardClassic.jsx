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
        <div className="relative">
            {/* Badge */}
            {rank && (
                <div
                    className={`absolute -top-3 left-6 z-20 h-8 w-8 rounded-full grid place-items-center text-white font-bold shadow ${badge}`}
                >
                    {rank}
                </div>
            )}

            <div className="rounded-[20px] bg-white shadow-md ring-1 ring-gray-200 overflow-hidden flex flex-col">
                {/* Ảnh */}
                <div className="px-6 pt-6">
                    {/* Khung ảnh: bo góc + ẩn tràn + có viền nhẹ + nền trắng */}
                    <div className="rounded-[16px] overflow-hidden ring-1 ring-gray-200 bg-white">
                        {/* Ép tỉ lệ vuông để mọi khung đồng đều, không méo/cắt góc */}
                        <div className="aspect-square">
                            <img
                                src={src}
                                alt={name}
                                className="w-full h-full object-contain p-2 block"
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
                            {author[0]}
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

                {/* Nút (giữ nguyên style hiện tại) */}
                <div className="px-6 pb-6 pt-2">
                    <button
                        onClick={() => (onUse ? onUse(frame) : nav(`/editor?alias=${alias}`))}
                        className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition active:scale-[.98]"
                    >
                        Thử khung này
                    </button>
                </div>
            </div>
        </div>
    )
}
