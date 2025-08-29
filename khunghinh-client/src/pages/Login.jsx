import CaptchaNote from '../components/CaptchaNote'
import { Circle } from 'lucide-react'

export default function Login() {
  return (
    <div className='max-w-md mx-auto px-4 py-16'>
      <h1 className='text-2xl font-bold mb-6'>Đăng nhập</h1>
      <form className='card p-6 space-y-4'>
        <input type='email' placeholder='Email' className='w-full border rounded px-3 py-2' />
        <input type='password' placeholder='Mật khẩu' className='w-full border rounded px-3 py-2' />
        <button className='w-full btn-primary'>Đăng nhập</button>
        <div className='text-center text-sm text-gray-500'>hoặc</div>
        <button type='button' className='w-full pill justify-center'>
          <Circle className='text-blue-600' size={16}/> Đăng nhập bằng Google
        </button>
        <CaptchaNote />
      </form>
    </div>
  )
}
