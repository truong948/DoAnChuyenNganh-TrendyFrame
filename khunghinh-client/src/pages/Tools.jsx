export default function Tools() {
  return (
    <div className='max-w-7xl mx-auto px-4 py-12'>
      <h1 className='text-2xl font-bold mb-6'>Công cụ</h1>
      <div className='grid md:grid-cols-3 gap-6'>
        {['Nén ảnh','Xoá nền','Đổi kích thước','Chuyển WebP','Làm mờ nền','Đóng dấu'].map((t,i)=>(
          <div key={i} className='card p-6'>
            <div className='font-semibold mb-1'>{t}</div>
            <p className='text-sm text-gray-600'>Sẽ triển khai sau khi nối API.</p>
            <button className='btn-primary mt-4'>Thử ngay</button>
          </div>
        ))}
      </div>
    </div>
  )
}
