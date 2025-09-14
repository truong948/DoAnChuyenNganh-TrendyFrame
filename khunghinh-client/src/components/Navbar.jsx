import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [me, setMe] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // đọc user từ localStorage
  const readMe = () => {
    try { return JSON.parse(localStorage.getItem('kh_me') || 'null') } catch { return null }
  }

  // mount + đổi route → đồng bộ me
  useEffect(() => { setMe(readMe()) }, [location.pathname])

  // lắng nghe thay đổi từ Login.jsx (custom event) & từ tab khác (storage)
  useEffect(() => {
    const sync = () => setMe(readMe())
    window.addEventListener('kh_me_changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('kh_me_changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // hiệu ứng scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // đóng menu khi đổi route
  useEffect(() => { setOpen(false) }, [location.pathname])

  // khóa cuộn khi mở menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // auto đóng khi resize lên desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('kh_me')
    window.dispatchEvent(new Event('kh_me_changed')) // báo các component khác
    setMe(null)
    navigate('/')
  }

  const name = me?.name || 'User'
  const avatarUrl =
    me?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=96`

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50',
          'transition-all duration-300',
          'bg-white/30',
          'supports-[backdrop-filter]:bg-white/20 supports-[backdrop-filter]:backdrop-blur-xl',
          scrolled ? 'shadow-md' : 'shadow-none'
        ].join(' ')}
      >
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 select-none" aria-label="Khung Hình">
            <img src="/frames/logo.png" alt="Logo Khung Hình" className="h-14 w-14 object-contain" />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 text-gray-800 font-medium">
            <NavLink to="/tools" className="hover:text-blue-600 transition">Công cụ</NavLink>
            <NavLink to="/trending" className="hover:text-blue-600 transition">Xu hướng</NavLink>
            <NavLink to="/editor" className="hover:text-blue-600 transition">Tạo khung</NavLink>

            {!me ? (
              <NavLink
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập
              </NavLink>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/frames/icon/default-avatar.png' // đảm bảo file này tồn tại trong /public
                  }}
                />
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Nút mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200/60 transition"
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Menu Mobile */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden px-6 pb-5 pt-2 space-y-4 bg-white/95 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md border-t border-gray-200"
          >
            <NavLink onClick={() => setOpen(false)} to="/tools" className="block text-gray-800">Công cụ</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/trending" className="block text-gray-800">Xu hướng</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/editor" className="block text-gray-800">Tạo khung</NavLink>

            {!me ? (
              <NavLink
                onClick={() => setOpen(false)}
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg inline-block"
              >
                Đăng nhập
              </NavLink>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/frames/icon/default-avatar.png'
                  }}
                />
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="h-[64px]" />
    </>
  )
}
