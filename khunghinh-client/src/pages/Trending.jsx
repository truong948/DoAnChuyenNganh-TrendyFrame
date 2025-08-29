import { useEffect, useState } from 'react'
import { getTrending } from '../utils/frameService'
import FrameGrid from '../components/FrameGrid'
import { useNavigate } from 'react-router-dom'

export default function Trending() {
  const [frames, setFrames] = useState([])
  const nav = useNavigate()
  useEffect(()=>{ getTrending().then(setFrames) },[])
  return (
    <div className='max-w-7xl mx-auto px-4 py-12'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Xu hướng 24h</h1>
        <div className='flex gap-2'>
          <button className='pill'>Tất cả</button>
          <button className='pill'>Sự kiện</button>
          <button className='pill'>Lễ hội</button>
          <button className='pill'>Cộng đồng</button>
        </div>
      </div>
      <FrameGrid frames={frames} onUse={(f)=>nav(`/editor?alias=${f.alias}`)} />
    </div>
  )
}
