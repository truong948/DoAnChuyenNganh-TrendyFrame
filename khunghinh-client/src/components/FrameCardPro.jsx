import { useNavigate } from 'react-router-dom'

/**
 * frame: { alias, name, thumb, tag, author, used24h, date }
 * rank:  1..n  (để hiện huy hiệu 1,2,3,4)
 * theme: 'blue' | 'orange'
 */
export default function FrameCardPro({ frame, rank, theme = 'blue', onUse }) {
    const nav = useNavigate()
    const handleUse = () => onUse ? onUse(frame) : nav(`/editor?alias=${frame.alias}`)

    const themeBtn = theme === 'orange'
        ? 'bg-orange-600 hover:bg-orange-700'
        : 'bg-blue-600 hover:bg-blue-700'

    const rankColor = ['bg-amber-400', 'bg-sky-400', 'bg-indigo-400', 'bg-blue-400'][Math.min(rank - 1, 3)] || 'bg-gray-300'

    return (
        <div className="relative">
            {/* Huy hiệu xếp hạng */}
            {rank ? (
                <div className={`absolute -top-4 -left-3 z-10 h-10 w-10 grid place-items-center text-white font-bold rounded-full shadow-lg ${rankColor}`}>
                    {rank}
                </div>
            ) : null}

            <div className="rounded-2xl bg-white shadow-[0_12px_40px_rgba(2,6,23,.06)] ring-1 ring-black/5 overflow-hidden flex flex-col">
                {/* Thumbnail */}
                <div className="p-4 pb-0">
                    <div className="rounded-2xl overflow-hidden shadow-inner">
                        <img src={frame.thumb} alt={frame.name} className="w-full aspect-square object-cover" />
                    </div>
                </div>

                {/* Body */}
                <div className="px-5 pt-4 pb-3 space-y-2">
                    <h3 className="text-lg font-semibold leading-snug line-clamp-2">{frame.name}</h3>
                    {frame.tag && (
                        <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            {frame.tag}
                        </span>
                    )}

                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-gray-200 grid place-items-center text-[11px] font-bold text-gray-700">
                                {frame.author?.[0] || 'A'}
                            </span>
                            <span className="font-medium">{frame.author || 'Ẩn danh'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1">
                                <span className="i-carbon-time" /> {frame.date || '—'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="i-carbon-view" /> {frame.used24h?.toLocaleString?.() || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 pt-0 mt-auto">
                    <button
                        onClick={handleUse}
                        className={`w-full rounded-full ${themeBtn} text-white font-semibold py-2 transition active:scale-[.98]`}
                    >
                        Thử khung này
                    </button>
                </div>
            </div>
        </div>
    )
}
