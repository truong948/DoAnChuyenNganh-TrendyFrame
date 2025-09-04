import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Theo dõi cuộn để đổi nền + đổ bóng
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Đóng menu khi đổi route (tránh menu “mất đồng bộ”)
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Khóa cuộn nền khi menu mở (mobile)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Đóng menu nếu resize về desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* Header fixed để không bao giờ "mất" khi lướt */}
      <header
        className={[
          'fixed top-0 inset-x-0 z-50',
          'transition-all duration-300',
          // nền trong suốt nhiều hơn
          'bg-white/30',
          // blur mạnh hơn
          'supports-[backdrop-filter]:bg-white/20 supports-[backdrop-filter]:backdrop-blur-xl',
          scrolled ? 'shadow-md' : 'shadow-none'
        ].join(' ')}
      >


        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 select-none" aria-label="Khung Hình">
            <img
              src="/frames/logo.png"
              alt="Logo Khung Hình"
              className="h-14 w-14 object-contain"   // h-14 = 56px
            />
          </Link>


          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 text-gray-800 font-medium">
            <NavLink to="/tools" className="hover:text-blue-600 transition">
              Công cụ
            </NavLink>
            <NavLink to="/trending" className="hover:text-blue-600 transition">
              Xu hướng
            </NavLink>
            <NavLink to="/editor" className="hover:text-blue-600 transition">
              Tạo khung
            </NavLink>
            <NavLink
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Đăng nhập
            </NavLink>
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

        {/* Menu Mobile (overlay sáng rõ, không bị “mờ mất chữ”) */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden px-6 pb-5 pt-2 space-y-4 bg-white/95 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md border-t border-gray-200"
          >
            <NavLink onClick={() => setOpen(false)} to="/tools" className="block text-gray-800">
              Công cụ
            </NavLink>
            <NavLink onClick={() => setOpen(false)} to="/trending" className="block text-gray-800">
              Xu hướng
            </NavLink>
            <NavLink onClick={() => setOpen(false)} to="/editor" className="block text-gray-800">
              Tạo khung
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg inline-block"
            >
              Đăng nhập
            </NavLink>
          </div>
        )}
      </header>

      {/* Spacer để nội dung không bị tràn lên dưới header fixed */}
      <div className="h-[64px]" />
    </>
  )
}
