import { useRef, useState } from 'react'

function fmtBytes(n) {
  if (n === 0) return '0 B'
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(n) / Math.log(k))
  return `${(n / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

async function loadBitmap(file) {
  try {
    return await createImageBitmap(file)
  } catch {
    // fallback
    return new Promise((res, rej) => {
      const img = new Image()
      img.onload = () => res(img)
      img.onerror = rej
      img.src = URL.createObjectURL(file)
    })
  }
}

/**
 * Nén ảnh client-side bằng <canvas>.
 * - PNG: mặc định chuyển sang WebP (giữ trong suốt, giảm mạnh).
 * - JPEG: nén lại JPEG.
 * - WEBP: nén lại WebP.
 */
async function compressImage(file, quality = 0.8, keepType = false) {
  const bitmap = await loadBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0)

  const ext = file.type.toLowerCase()
  let outType = 'image/webp' // mặc định ưu tiên webp
  if (keepType) {
    outType = ext || 'image/webp'
  } else {
    if (ext.includes('jpeg') || ext.includes('jpg')) outType = 'image/jpeg'
    // PNG -> WebP để giảm dung lượng, vẫn giữ alpha
  }

  const dataUrl = canvas.toDataURL(outType, quality)
  const res = await (await fetch(dataUrl)).blob()

  // tên file đầu ra
  const newName = file.name.replace(/\.[^.]+$/, '') + (outType.includes('jpeg') ? '.jpg' : outType.includes('png') ? '.png' : '.webp')
  return new File([res], newName, { type: outType })
}

export default function Compress() {
  const inputRef = useRef(null)
  const [items, setItems] = useState([]) // {file, outFile, saving}
  const [quality, setQuality] = useState(0.8)
  const [keepType, setKeepType] = useState(false)

  const onPick = async (files) => {
    const list = Array.from(files || [])
    if (!list.length) return

    const next = list.map(f => ({ file: f, outFile: null, saving: true }))
    setItems(prev => [...prev, ...next])

    for (let i = 0; i < list.length; i++) {
      const f = list[i]
      try {
        const out = await compressImage(f, quality, keepType)
        setItems(prev =>
          prev.map(it => it.file === f ? { ...it, outFile: out, saving: false } : it)
        )
      } catch (e) {
        console.error('Compress failed:', e)
        setItems(prev =>
          prev.map(it => it.file === f ? { ...it, outFile: null, saving: false } : it)
        )
      }
    }
  }

  const onDrop = (e) => { e.preventDefault(); onPick(e.dataTransfer.files) }

  const totalSaved = items.reduce((acc, it) => {
    if (!it.outFile) return acc
    return acc + (it.file.size - it.outFile.size)
  }, 0)

  const downloadAll = async () => {
    // tải từng file (đủ dùng). Nếu muốn .zip hãy thêm JSZip.
    for (const it of items) {
      if (!it.outFile) continue
      const url = URL.createObjectURL(it.outFile)
      const a = document.createElement('a')
      a.href = url
      a.download = it.outFile.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      {/* banner + dropzone giống ảnh mẫu */}
      <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 mt-8">
        <div className="rounded-2xl bg-amber-50/50 p-8">
          <h1 className="text-3xl font-extrabold mb-2">Nén hình ảnh</h1>
          <p className="text-slate-600">Giảm dung lượng, giữ chất lượng tốt. Hỗ trợ PNG / JPG / WebP.</p>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <label className="inline-flex items-center gap-2 text-sm">
              <span className="font-medium">Chất lượng</span>
              <input type="range" min="0.4" max="0.95" step="0.01"
                value={quality}
                onChange={e => setQuality(+e.target.value)}
              />
              <span className="w-10 text-right">{Math.round(quality * 100)}%</span>
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={keepType} onChange={e => setKeepType(e.target.checked)} />
              Giữ định dạng gốc
            </label>
          </div>

          <div className="mt-6 rounded-xl border-2 border-dashed grid place-items-center p-8 bg-white"
               onDrop={onDrop}
               onDragOver={e => e.preventDefault()}>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700"
            >
              Chọn hình
            </button>
            <div className="mt-2 text-slate-500 text-sm">Kéo thả hoặc bấm để chọn nhiều ảnh</div>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                   onChange={e => onPick(e.target.files)} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Tổng dung lượng giảm</div>
            <button
              onClick={downloadAll}
              disabled={!items.some(it => it.outFile)}
              className={`px-4 py-2 rounded-lg text-white text-sm
                ${items.some(it => it.outFile) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-300 cursor-not-allowed'}`}
            >
              ⬇ Tải tất cả
            </button>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">
            {totalSaved > 0 ? `-${((totalSaved / (totalSaved + items.reduce((a, i)=>a+(i.outFile?.size||0),0))) * 100 || 0).toFixed(1)}%` : '-0%'}
            <span className="ml-2 text-base font-semibold text-slate-500">({fmtBytes(totalSaved)} đã giảm)</span>
          </div>
        </div>
      </div>

      {/* danh sách file */}
      <div className="mt-8 space-y-3">
        {items.map((it, idx) => {
          const before = it.file.size
          const after = it.outFile?.size ?? before
          const saved = Math.max(0, before - after)
          const pct = before ? Math.round((saved / before) * 100) : 0

          return (
            <div key={idx} className="rounded-xl border bg-white p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center text-xs font-semibold">
                {it.file.type.includes('png') ? 'PNG' : it.file.type.includes('jpeg') ? 'JPG' : 'IMG'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.outFile?.name || it.file.name}</div>
                <div className="text-xs text-slate-500">
                  {fmtBytes(before)} → {fmtBytes(after)} &nbsp;|&nbsp; Giảm {pct}%
                </div>
              </div>

              {it.saving ? (
                <div className="text-sm text-slate-500">Đang nén…</div>
              ) : it.outFile ? (
                <a
                  href={URL.createObjectURL(it.outFile)}
                  download={it.outFile.name}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                >
                  Tải
                </a>
              ) : (
                <div className="text-rose-600 text-sm">Lỗi</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
