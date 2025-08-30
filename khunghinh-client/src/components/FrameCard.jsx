// src/components/FrameCard.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function FrameCard({ frame, onUse }) {
  const nav = useNavigate()
  const handleUse = () => {
    if (onUse) return onUse(frame)
    nav(`/editor?alias=${frame.alias}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="card overflow-hidden tilt"
    >
      <div className="relative">
        <img src={frame.thumb} alt={frame.name} className="w-full h-48 object-cover" />
        {/* overlay hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-black/30 flex items-center justify-center">
          <button onClick={handleUse} className="btn-primary">
            Thử khung này
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="font-semibold line-clamp-1">{frame.name}</div>
        <div className="text-xs text-gray-500">
          Alias: {frame.alias} • {frame.used24h} lượt/24h
        </div>
        {/* nút hiển thị luôn (mobile/không hover) */}
        <button onClick={handleUse} className="btn-primary w-full mt-3 sm:hidden">
          Thử khung này
        </button>
      </div>
    </motion.div>
  )
}

