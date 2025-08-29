import { motion } from 'framer-motion'

export default function FrameCard({ frame, onUse }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      whileHover={{ scale:1.03 }} className='card overflow-hidden tilt'>
      <div className='relative'>
        <img src={frame.thumb} alt={frame.name} className='w-full h-48 object-cover' />
        <div className='absolute inset-0 opacity-0 hover:opacity-100 transition bg-black/30 flex items-center justify-center'>
          <button onClick={() => onUse?.(frame)} className='btn-ghost'>Dùng ngay</button>
        </div>
      </div>
      <div className='p-3'>
        <div className='font-semibold'>{frame.name}</div>
        <div className='text-xs text-gray-500'>Alias: {frame.alias} • {frame.used24h} lượt/24h</div>
      </div>
    </motion.div>
  )
}
