import { QRCodeCanvas } from 'qrcode.react'
export default function QrModal({ open, onClose, text }) {
  if (!open) return null
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl p-6 w-[340px] text-center card'>
        <h3 className='font-semibold mb-2'>QR Code chia sẻ</h3>
        <p className='text-xs text-gray-500 mb-3 break-all'>{text}</p>
        <div className='flex justify-center mb-4'><QRCodeCanvas value={text || ''} size={220} /></div>
        <button onClick={onClose} className='btn-primary'>Đóng</button>
      </div>
    </div>
  )
}
