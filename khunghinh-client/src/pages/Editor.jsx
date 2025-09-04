// src/pages/Editor.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getFrameByAlias } from '../utils/frameService'
import useImage from 'use-image'
import { Stage, Layer, Image as KImage, Rect, Group, Text as KText } from 'react-konva'

const EXPORT_SIZE = 1080
const PREVIEW_MAX = 500
const PREVIEW_MIN = 300
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// luôn dùng anonymous để cho phép canvas export nếu server trả CORS đúng
const corsMode = () => 'anonymous'

/* ================= Helpers ================= */
function CenterImage({ url, scale, rotation, flipX }) {
  const [img] = useImage(url || '', corsMode())
  if (!img) return null
  return (
    <KImage
      image={img}
      x={0}
      y={0}
      offsetX={img.width / 2}
      offsetY={img.height / 2}
      draggable
      scaleX={scale * (flipX ? -1 : 1)}
      scaleY={scale}
      rotation={rotation}
    />
  )
}

function Overlay({ url, size }) {
  const [img] = useImage(url || '', corsMode())
  return img ? (
    <KImage image={img} x={-size / 2} y={-size / 2} width={size} height={size} listening={false} />
  ) : null
}

/* Hộp kéo-thả upload (dropzone) */
function Dropzone({ onPick, className = '' }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const openPicker = () => inputRef.current?.click()
  const onFiles = (files) => {
    const f = files?.[0]
    if (f) onPick(f)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      className={[
        'w-full h-32 sm:h-36 rounded-xl border-2 border-dashed grid place-items-center',
        'transition-colors select-none cursor-pointer',
        dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white',
        className,
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          className="mx-auto mb-2 h-7 w-7 text-slate-700" fill="currentColor">
          <path d="M7 18a5 5 0 0 1-.75-9.94 6 6 0 0 1 11.5 1.63A4 4 0 1 1 18 18H7Zm6-7v4a1 1 0 1 1-2 0v-4H9.5a1 1 0 0 1-.7-1.7l2.5-2.5a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 0 1-.7 1.7H13Z" />
        </svg>
        <div className="text-slate-900 font-semibold text-sm">
          Kéo thả hoặc <span className="text-indigo-600">Bấm vào đây</span>
        </div>
        <div className="text-slate-500 text-sm">để đăng tải hình ảnh</div>
      </div>
    </div>
  )
}

/* ================= Page ================= */
export default function Editor() {
  const { alias: aliasParam } = useParams()
  const [params] = useSearchParams()
  const alias = aliasParam || params.get('alias') || 'quockhanh'

  const [frame, setFrame] = useState(null)
  const [userUrl, setUserUrl] = useState('')
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipX, setFlipX] = useState(false)

  // Văn bản
  const [textMode, setTextMode] = useState(false)
  const [text, setText] = useState('Tự hào Việt Nam')
  const [textSize, setTextSize] = useState(28)
  const [textColor, setTextColor] = useState('#0f172a')

  // trạng thái sẵn sàng export
  const [ready, setReady] = useState(false)
  const [lastObjectUrl, setLastObjectUrl] = useState(null)

  // Preview size
  const [viewSize, setViewSize] = useState(PREVIEW_MAX)
  const boxRef = useRef(null)
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const w = boxRef.current?.clientWidth || (PREVIEW_MAX + 40)
      const s = Math.max(PREVIEW_MIN, Math.min(PREVIEW_MAX, Math.floor(w - 40)))
      setViewSize(s)
    })
    if (boxRef.current) ro.observe(boxRef.current)
    return () => ro.disconnect()
  }, [])

  // lấy khung theo alias
  useEffect(() => {
    getFrameByAlias(alias).then(setFrame)
  }, [alias])

  // Reset state khi đổi alias
  useEffect(() => {
    setUserUrl('')
    setScale(1)
    setRotation(0)
    setFlipX(false)
    setTextMode(false)
  }, [alias])

  const overlayUrl = useMemo(() => frame?.overlay || frame?.thumb || null, [frame])

  const stageRef = useRef(null)
  const fileInputRef = useRef(null)
  const shareRef = useRef(null)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  // sẵn sàng khi có ảnh người dùng và overlay đã xác định
  useEffect(() => {
    setReady(!!userUrl && !!overlayUrl)
  }, [userUrl, overlayUrl])

  // cursor + wheel zoom (chỉ bật khi có ảnh)
  const setStageCursor = (cur) => {
    const c = stageRef.current?.container()
    if (c) c.style.cursor = cur
  }
  const wheelTimerRef = useRef(null)
  const handleWheel = (e) => {
    if (!userUrl) return
    e.evt.preventDefault()
    const out = e.evt.deltaY > 0
    setStageCursor(out ? 'zoom-out' : 'zoom-in')
    clearTimeout(wheelTimerRef.current)
    wheelTimerRef.current = setTimeout(
      () => setStageCursor(textMode ? 'text' : 'grab'), 120
    )
    const factor = out ? 0.95 : 1.05
    setScale((s) => clamp(s * factor, 0.2, 3))
  }

  const downloadPNG = () => {
    const node = stageRef.current
    if (!node) return
    const pixelRatio = EXPORT_SIZE / viewSize
    try {
      const dataURL = node.toDataURL({
        pixelRatio,
        mimeType: 'image/png',
        quality: 1,
      })
      const a = document.createElement('a')
      a.href = dataURL
      a.download = `${alias}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error('Save failed:', err)
      alert(
        'Không thể tải ảnh.\nCó thể do ảnh khung/overlay hoặc ảnh tải lên không cho phép CORS.\n' +
        'Hãy host file overlay/ảnh cùng domain hoặc bật Access-Control-Allow-Origin: *.'
      )
    }
  }

  const resetAll = () => { setScale(1); setRotation(0); setFlipX(false); setTextMode(false) }
  const zoomStep = 0.05
  const rotStep = 5
  const hasImage = !!userUrl

  const pickFile = (file) => {
    if (!file) return
    const nextUrl = URL.createObjectURL(file)
    if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
    setLastObjectUrl(nextUrl)
    setUserUrl(nextUrl)
  }

  // thu hồi khi unmount
  useEffect(() => {
    return () => {
      if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
    }
  }, [lastObjectUrl])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-center mb-5">#TuhaoVietNam</h1>

      {/* KHUNG NÉT ĐỨT CHÍNH */}
      <div
        ref={boxRef}
        className="max-w-[560px] mx-auto border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white"
      >
        {/* Preview */}
        <div className="flex justify-center">
          <Stage
            key={alias}                 // remount khi đổi alias
            ref={stageRef}
            width={viewSize}
            height={viewSize}
            className="rounded-md"
            onMouseEnter={() => setStageCursor(hasImage ? (textMode ? 'text' : 'grab') : 'default')}
            onMouseLeave={() => setStageCursor('default')}
            onMouseDown={(e) => {
              if (!hasImage) return
              if (e.target?.draggable?.() || e.target?.attrs?.draggable) setStageCursor('grabbing')
            }}
            onMouseUp={() => setStageCursor(hasImage ? (textMode ? 'text' : 'grab') : 'default')}
            onDragStart={() => hasImage && setStageCursor('grabbing')}
            onDragEnd={() => setStageCursor(hasImage ? (textMode ? 'text' : 'grab') : 'default')}
            onWheel={handleWheel}
          >
            <Layer>
              {!hasImage && (
                <Rect x={0} y={0} width={viewSize} height={viewSize} fill="#f3f4f6" />
              )}
              <Group x={viewSize / 2} y={viewSize / 2}>
                {hasImage && (
                  <CenterImage url={userUrl} scale={scale} rotation={rotation} flipX={flipX} />
                )}
                {textMode && hasImage && (
                  <KText
                    text={text}
                    fontSize={textSize}
                    fill={textColor}
                    x={0}
                    y={-viewSize * 0.18}
                    align="center"
                    width={viewSize}
                    draggable
                  />
                )}
                {overlayUrl && <Overlay url={overlayUrl} size={viewSize} />}
              </Group>
            </Layer>
          </Stage>
        </div>

        {/* CHƯA CÓ ẢNH → Dropzone to */}
        {!hasImage && (
          <div className="mt-4">
            <Dropzone onPick={pickFile} />
          </div>
        )}

        {/* ĐÃ CÓ ẢNH → Controls + NÚT ĐỔI HÌNH */}
        {hasImage && (
          <>
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setFlipX((v) => !v)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-sm flex items-center gap-2"
                >
                  <img src="/icon/fliptheimage.png" alt="Lật hình" className="w-4 h-4" />
                  <span>Lật hình</span>
                </button>
                <button
                  onClick={() => setTextMode((v) => !v)}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 ${textMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                  <img src="/icon/text.png" alt="Văn bản" className="w-4 h-4" />
                  <span>Văn bản</span>
                </button>
              </div>
              <button
                onClick={resetAll}
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-sm flex items-center gap-2"
              >
                <img src="/icon/reset.png" alt="Reset" className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* sliders */}
            <div className="mt-3 grid gap-3 text-sm">
              {/* Zoom slider */}
              <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
                <button
                  onClick={() => setScale((s) => clamp(+(s - 0.05).toFixed(3), 0.2, 3))}
                  className="h-8 w-8 rounded-md border bg-white hover:bg-slate-50 flex items-center justify-center"
                  title="Thu nhỏ"
                >
                  <img src="/icon/tru.png" alt="Thu nhỏ" className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(+e.target.value)}
                  className="slider-soft"
                  style={{ '--percent': `${((scale - 0.2) / (3 - 0.2)) * 100}%` }}
                />

                <button
                  onClick={() => setScale((s) => clamp(+(s + 0.05).toFixed(3), 0.2, 3))}
                  className="h-8 w-8 rounded-md border bg-white hover:bg-slate-50 flex items-center justify-center"
                  title="Phóng to"
                >
                  <img src="/icon/cong.png" alt="Phóng to" className="w-4 h-4" />
                </button>
              </div>

              {/* Rotation slider */}
              <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
                <button
                  onClick={() => setRotation((r) => r - 5)}
                  className="h-8 w-8 rounded-md border bg-white hover:bg-slate-50"
                  title="Xoay trái"
                >
                  ↶
                </button>

                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(+e.target.value)}
                  className="slider-soft"
                  style={{ '--percent': `${((rotation - (-180)) / (180 - (-180))) * 100}%` }}
                />

                <button
                  onClick={() => setRotation((r) => r + 5)}
                  className="h-8 w-8 rounded-md border bg-white hover:bg-slate-50"
                  title="Xoay phải"
                >
                  ↷
                </button>
              </div>
            </div>

            {/* hàng nút dưới */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) pickFile(f)
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 font-medium text-sm flex items-center gap-2"
                >
                  <img src="/icon/image.png" alt="Đổi hình" className="w-4 h-4" />
                  <span>Đổi hình</span>
                </button>
              </div>

              <button
                onClick={downloadPNG}
                disabled={!ready}
                aria-disabled={!ready}
                className={`px-3.5 py-1.5 rounded-md text-sm flex items-center gap-2 border transition-colors
                ${ready
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                  }`}
                title={ready ? 'Xuất ảnh PNG' : 'Hãy chờ ảnh/khung sẵn sàng'}
              >
                <img src="/icon/download2.png" alt="Tải về" className={`w-4 h-4 ${ready ? '' : 'opacity-60'}`} />
                <span className="font-bold">Tải về</span>
              </button>
            </div>

            {textMode && (
              <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nhập nội dung"
                  className="sm:col-span-2 rounded-md border px-3 py-2 outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={14} max={72} value={textSize}
                    onChange={(e) => setTextSize(+e.target.value)}
                    className="w-24 rounded-md border px-2 py-2 outline-none"
                  />
                  <input
                    type="color" value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-9 w-9 rounded-md border p-0"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* PHẦN CHIA SẺ */}
      <div ref={shareRef} className="mt-8 flex flex-col items-center">
        <img
          alt="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Huy_hieu_doan.svg/120px-Huy_hieu_doan.svg.png"
          className="w-14 h-14 object-contain"
        />
        <h3 className="mt-2 font-semibold text-base">Ban Tuyên giáo TW Đoàn</h3>
        <div className="text-gray-500 text-xs mt-1">08:17 18/08/2025</div>

        <div className="mt-4 w-full max-w-[520px] rounded-xl border border-dashed border-gray-300 p-3">
          <div className="text-gray-600 font-medium mb-2 text-sm">Chia sẻ</div>

          <div className="relative">
            <input
              readOnly value={shareUrl}
              className="w-full rounded-md border border-indigo-200 bg-indigo-50/40 px-3 py-2 pr-10 outline-none text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700"
              title="Sao chép"
            >
              ⧉
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <img
              alt="qr" width="120" height="120"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shareUrl)}`}
              className="rounded-md"
            />
            <div className="flex gap-2">
              <a
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                href={`https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(shareUrl)}`}
                download="qr.png"
              >
                Tải mã QR
              </a>
              <button
                onClick={downloadPNG}
                disabled={!ready}
                className={`px-3 py-1.5 rounded-md text-sm ${ready
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
              >
                Tải ảnh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
