import { useEffect, useMemo, useRef, useState } from "react"
import { Download, Image as ImageIcon, ChevronLeft, Upload } from "lucide-react"

export default function Resize() {
  const fileInputRef = useRef(null)

  // ===== state =====
  const [step, setStep] = useState("empty") // empty | edit | result
  const [file, setFile] = useState(null)
  const [imgUrl, setImgUrl] = useState("")
  const [natural, setNatural] = useState({ w: 0, h: 0 })

  // options
  const [keepRatio, setKeepRatio] = useState(true)
  const [allowUpscale, setAllowUpscale] = useState(false)
  const [target, setTarget] = useState({ w: 0, h: 0 })

  // kết quả
  const [outUrl, setOutUrl] = useState("")
  const [outSize, setOutSize] = useState({ w: 0, h: 0 })

  // ===== helpers =====
  const openPicker = () => fileInputRef.current?.click()

  const handlePick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setImgUrl(url)

    const im = new Image()
    im.onload = () => {
      const w = im.naturalWidth
      const h = im.naturalHeight
      setNatural({ w, h })
      setTarget({ w, h })
      setStep("edit")
    }
    im.src = url
  }

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl)
      if (outUrl) URL.revokeObjectURL(outUrl)
    }
  }, [imgUrl, outUrl])

  // đổi chiều rộng/cao
  const updateWidth = (w) => {
    w = Math.max(1, Math.round(+w || 0))
    if (keepRatio && natural.w) {
      const ratio = natural.h / natural.w
      setTarget({ w, h: Math.max(1, Math.round(w * ratio)) })
    } else setTarget((t) => ({ ...t, w }))
  }
  const updateHeight = (h) => {
    h = Math.max(1, Math.round(+h || 0))
    if (keepRatio && natural.h) {
      const ratio = natural.w / natural.h
      setTarget({ h, w: Math.max(1, Math.round(h * ratio)) })
    } else setTarget((t) => ({ ...t, h }))
  }

  // preset
  const applyPreset = (w, h) => {
    if (keepRatio) {
      const r0 = natural.w / natural.h
      const r1 = w / h
      if (Math.abs(r0 - r1) < 0.06) {
        setTarget({ w, h })
      } else {
        setTarget({ w, h: Math.round(w / r0) })
      }
    } else {
      setTarget({ w, h })
    }
  }

  // resize bằng canvas
  const onResize = async () => {
    if (!file || !target.w || !target.h) return

    const src = await readImage(file)
    let tw = target.w, th = target.h
    if (!allowUpscale) {
      tw = Math.min(tw, natural.w)
      th = Math.min(th, natural.h)
    }

    const { blob, w, h } = await resizeImage(src, tw, th)
    const url = URL.createObjectURL(blob)
    setOutUrl(url)
    setOutSize({ w, h })
    setStep("result")
  }

  const resetAll = () => {
    setFile(null)
    setImgUrl("")
    setOutUrl("")
    setStep("empty")
  }

  const prettyName = useMemo(() => {
    if (!file) return ""
    const base = file.name.replace(/\.[^.]+$/, "")
    const ext = (file.name.split(".").pop() || "png").toLowerCase()
    return `${base}-${target.w}x${target.h}.${ext}`
  }, [file, target])

  return (
    <div className="relative min-h-[80vh] bg-white">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-6">
          Thay đổi kích thước
        </h1>

        {/* ===== STEP 1 ===== */}
        {step === "empty" && (
          <div className="text-center">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tải ảnh JPEG, PNG và thay đổi kích thước dễ dàng với công cụ online.
            </p>
            <button
              onClick={openPicker}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              <Upload size={18}/> Chọn ảnh
            </button>
            <input ref={fileInputRef} onChange={handlePick} type="file" accept="image/*" hidden />
          </div>
        )}

        {/* ===== STEP 2 ===== */}
        {step === "edit" && (
          <div className="grid md:grid-cols-[1fr_360px] gap-8">
            {/* preview */}
            <div className="mx-auto">
              <div className="card bg-white rounded-2xl border shadow p-4 w-[320px] h-[380px] grid place-items-center">
                {imgUrl && <img src={imgUrl} alt="preview" className="max-w-full max-h-56 object-contain" />}
                <div className="w-full text-sm mt-3">
                  <div className="font-semibold truncate">{file?.name}</div>
                  <div className="text-blue-700">
                    {natural.w}x{natural.h} → {target.w}x{target.h}
                  </div>
                </div>
                <button onClick={resetAll} className="mt-2 text-red-500 hover:underline text-sm">Xóa</button>
              </div>
            </div>

            {/* panel */}
            <aside className="card bg-white rounded-2xl border shadow p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">Tùy chọn</div>
                <button
                  onClick={openPicker}
                  className="rounded-lg px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Chọn ảnh khác
                </button>
                <input ref={fileInputRef} onChange={handlePick} type="file" accept="image/*" hidden />
              </div>

              {/* preset */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => applyPreset(1080,1080)}
                  className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
                >
                  1080x1080
                </button>
                <button
                  onClick={() => applyPreset(2048,2048)}
                  className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
                >
                  2048x2048
                </button>
              </div>

              {/* chi tiết */}
              <div className="mt-5 space-y-4">
                <label className="text-sm font-medium text-gray-700">Chi tiết kích thước</label>
                <div className="grid grid-cols-[110px_1fr] gap-2 items-center">
                  <span>Chiều rộng</span>
                  <input type="number" min="1" value={target.w || ""} onChange={(e) => updateWidth(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2" />
                  <span>Chiều cao</span>
                  <input type="number" min="1" value={target.h || ""} onChange={(e) => updateHeight(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2" />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={keepRatio} onChange={() => setKeepRatio(v => !v)} />
                  <span>Giữ tỷ lệ cạnh</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={allowUpscale} onChange={() => setAllowUpscale(v => !v)} />
                  <span>Cho phép phóng to</span>
                </div>

                <button
                  onClick={onResize}
                  className="w-full mt-4 inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Xem kết quả
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ===== STEP 3 ===== */}
        {step === "result" && (
          <div className="text-center">
            <div className="card bg-white rounded-2xl border shadow p-4 w-[320px] h-[380px] mx-auto grid place-items-center">
              {outUrl ? (
                <img src={outUrl} alt="result" className="max-w-full max-h-56 object-contain" />
              ) : (
                <div className="text-gray-400 grid place-items-center gap-2">
                  <ImageIcon /> Xử lý…
                </div>
              )}
              <div className="text-blue-700 mt-3">{outSize.w}x{outSize.h}</div>

              <a
                href={outUrl}
                download={prettyName || "resized.png"}
                className="mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                <Download size={18}/> Tải về
              </a>
            </div>

            <button
              onClick={() => setStep("edit")}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              <ChevronLeft size={18}/> Trở lại
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* utils */
function readImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
function resizeImage(img, targetW, targetH, type = "image/png", quality = 0.92) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(targetW))
    canvas.height = Math.max(1, Math.round(targetH))
    const ctx = canvas.getContext("2d")
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      resolve({ blob, w: canvas.width, h: canvas.height })
    }, type, quality)
  })
}
