import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-white/30' : 'backdrop-blur-sm bg-transparent'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-wide"
        >
          Khung Hình
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
          className="md:hidden p-2 rounded-lg hover:bg-gray-200/40 transition"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu Mobile */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white/80 backdrop-blur-md">
          <NavLink onClick={() => setOpen(false)} to="/tools" className="block">
            Công cụ
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/trending" className="block">
            Xu hướng
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/editor" className="block">
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
  )
}
