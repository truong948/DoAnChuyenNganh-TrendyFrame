import FrameCard from './FrameCard'
export default function FrameGrid({ frames=[], onUse }) {
  return <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
    {frames.map(f => <FrameCard key={f.alias} frame={f} onUse={onUse} />)}
  </div>
}
