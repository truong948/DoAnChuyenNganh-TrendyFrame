// src/pages/Editor.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getFrameByAlias, getFrames } from '../utils/frameService'
import QrModal from '../components/QrModal'
import { HexColorPicker } from 'react-colorful'
import useImage from 'use-image' // npm i use-image
import { Stage, Layer, Image as KImage, Rect } from 'react-konva'

/* ================= Helper components ================= */

function UserImage({ url, scale, rotation }) {
  const [imageObj, setImageObj] = useState(null)

  useEffect(() => {
    if (!url) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImageObj(img)
    img.src = url
  }, [url])

  if (!imageObj) return null
  const w = imageObj.width
  const h = imageObj.height

  // đặt ảnh ở giữa, cho kéo tự do
  return (
    <KImage
      image={imageObj}
      x={400}
      y={400}
      offsetX={w / 2}
      offsetY={h / 2}
      draggable
      scaleX={scale}
      scaleY={scale}
      rotation={rotation}
    />
  )
}

function FrameOverlay({ url }) {
  // PNG khung trong suốt
  const [img] = useImage(url, 'anonymous')
  return img ? (
    <KImage image={img} x={0} y={0} width={800} height={800} listening={false} />
  ) : null
}

/* ================= Main Editor ================= */

export default function Editor() {
  const [params] = useSearchParams()
  const initialAlias = params.get('alias') || 'tet'

  const stageRef = useRef(null)

  const [userUrl, setUserUrl] = useState('')
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const [alias, setAlias] = useState(initialAlias)
  const [frame, setFrame] = useState(null)
  const [frames, setFrames] = useState([])

  // fallback khi KHÔNG có PNG overlay
  const [thickness, setThickness] = useState(40)
  const [color, setColor] = useState('#2563eb')

  const [qrOpen, setQrOpen] = useState(false)
  const [crop, setCrop] = useState({ enabled: false, x: 100, y: 100, size: 600 })

  useEffect(() => { getFrames().then(setFrames) }, [])
  useEffect(() => {
    getFrameByAlias(alias).then(f => {
      setFrame(f)
      if (f?.color) setColor(f.color)
    })
  }, [alias])

  const overlayUrl = useMemo(
    () => frame?.overlay || frame?.thumb || null,
    [frame]
  )
  const hasOverlayPng = Boolean(frame?.overlay)

  const onUpload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUserUrl(URL.createObjectURL(f))
  }

  const onLoadUrl = () => {
    const v = prompt('Nhập URL ảnh (https://...)')
    if (v) setUserUrl(v)
  }

  const exportPng = () => {
    const st = stageRef.current
    if (!st) return

    // lưu lại trạng thái
    const old = {
      w: st.width(),
      h: st.height(),
      x: st.x(),
      y: st.y(),
    }

    let dataUrl
    if (crop.enabled) {
      st.width(crop.size)
      st.height(crop.size)
      st.x(-crop.x)
      st.y(-crop.y)
      st.draw()
      dataUrl = st.toDataURL({ mimeType: 'image/png', pixelRatio: 2 })
      // reset
      st.x(old.x); st.y(old.y); st.width(old.w); st.height(old.h); st.draw()
    } else {
      dataUrl = st.toDataURL({ mimeType: 'image/png', pixelRatio: 2 })
    }

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `khung-${alias}.png`
    a.click()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Trình chỉnh ảnh</h1>

      <div className="card p-4 mb-6 grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Canvas */}
        <div className="border rounded-xl overflow-hidden relative">
          <Stage ref={stageRef} width={800} height={800}>
            <Layer>
              {userUrl ? (
                <UserImage url={userUrl} scale={scale} rotation={rotation} />
              ) : (
                <Rect x={0} y={0} width={800} height={800} fill={'#f3f4f6'} />
              )}

              {/* Overlay PNG nếu có, nếu không thì viền màu fallback */}
              {overlayUrl ? (
                <FrameOverlay url={overlayUrl} />
              ) : (
                <Rect
                  x={0}
                  y={0}
                  width={800}
                  height={800}
                  listening={false}
                  stroke={color}
                  strokeWidth={thickness}
                />
              )}

              {/* Crop mask preview */}
              {crop.enabled && (
                <>
                  <Rect x={0} y={0} width={800} height={800} fill="rgba(0,0,0,0.45)" />
                  <Rect
                    x={crop.x}
                    y={crop.y}
                    width={crop.size}
                    height={crop.size}
                    fill="transparent"
                    stroke="white"
                    strokeWidth={2}
                    listening={false}
                  />
                </>
              )}
            </Layer>
          </Stage>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <input type="file" accept="image/*" onChange={onUpload} />
            <button onClick={onLoadUrl} className="pill">Dán URL ảnh</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Zoom {scale.toFixed(2)}</label>
            <input type="range" min="0.2" max="3" step="0.01" value={scale} onChange={e => setScale(+e.target.value)} />

            <label className="text-sm">Xoay {rotation}°</label>
            <input type="range" min="-180" max="180" step="1" value={rotation} onChange={e => setRotation(+e.target.value)} />

            {/* Khóa điều khiển khi có overlay PNG */}
            <label className={`text-sm ${hasOverlayPng ? 'opacity-50' : ''}`}>Độ dày khung {thickness}px</label>
            <input
              type="range"
              min="10" max="100" step="2"
              value={thickness}
              onChange={e => setThickness(+e.target.value)}
              disabled={hasOverlayPng}
            />
          </div>

          <div className={`${hasOverlayPng ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="text-sm mb-2">Màu khung (fallback)</div>
            <HexColorPicker color={color} onChange={setColor} />
          </div>

          <div className="grid gap-3">
            <select value={alias} onChange={e => setAlias(e.target.value)} className="border rounded px-2 py-2">
              {frames.map(f => <option key={f.alias} value={f.alias}>{f.name}</option>)}
            </select>

            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={exportPng} className="btn-primary">Xuất ảnh</button>
              <button onClick={() => setQrOpen(true)} className="pill">QR chia sẻ</button>

              <label className="pill">
                <input
                  className="mr-2"
                  type="checkbox"
                  checked={crop.enabled}
                  onChange={e => setCrop({ ...crop, enabled: e.target.checked })}
                />
                Bật chế độ cắt (crop)
              </label>
            </div>

            {crop.enabled && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label>X: {crop.x}</label>
                <input type="range" min="0" max="200" value={crop.x} onChange={e => setCrop({ ...crop, x: +e.target.value })} />
                <label>Y: {crop.y}</label>
                <input type="range" min="0" max="200" value={crop.y} onChange={e => setCrop({ ...crop, y: +e.target.value })} />
                <label>Kích thước: {crop.size}</label>
                <input type="range" min="200" max="800" step="10" value={crop.size} onChange={e => setCrop({ ...crop, size: +e.target.value })} />
              </div>
            )}
          </div>
        </div>
      </div>

      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} text={window.location.href} />
    </div>
  )
}

/* ================= Utils ================= */

function loadImage(src, cross = false) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (cross) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Fit ảnh người dùng theo kiểu cover vào vùng vuông SIZE x SIZE
function coverFit(imgW, imgH, boxW, boxH) {
  const r = Math.max(boxW / imgW, boxH / imgH)
  const sx = (imgW - boxW / r) / 2
  const sy = (imgH - boxH / r) / 2
  const sw = boxW / r
  const sh = boxH / r
  return { sx, sy, sw, sh }
}
