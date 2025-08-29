import { Globe, Facebook, UsersRound } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1f2a3a] text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-4">

        {/* Cột 1: Logo + ngôn ngữ */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center font-bold">
              {/* logo đơn giản */}
              <span>📄</span>
            </div>
            <span className="text-xl font-extrabold">Khunghinh</span>
          </div>

          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-md text-sm">
            <Globe className="h-4 w-4" />
            Tiếng Việt
            <span className="opacity-70">▾</span>
          </button>
        </div>

        {/* Cột 2: Khunghinh */}
        <div>
          <h3 className="font-semibold mb-3">Khunghinh</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Liên hệ</a></li>
            <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Cột 3: Công cụ */}
        <div>
          <h3 className="font-semibold mb-3">Công cụ</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/editor" className="hover:text-white">Tạo khung hình</a></li>
            <li><a href="#" className="hover:text-white">Xóa nền</a></li>
            <li><a href="#" className="hover:text-white">Tạo vùng trong suốt</a></li>
            <li><a href="#" className="hover:text-white">Nén hình ảnh</a></li>
            <li><a href="#" className="hover:text-white">Thay đổi kích thước</a></li>
          </ul>
        </div>

        {/* Cột 4: Theo dõi */}
        <div>
          <h3 className="font-semibold mb-3">Theo dõi chúng tôi</h3>
          <div className="flex items-center gap-4">
            <a href="#" className="bg-white/10 hover:bg-white/20 transition p-3 rounded-full">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="bg-white/10 hover:bg-white/20 transition p-3 rounded-full">
              <UsersRound className="h-5 w-5" />
            </a>
          </div>
          <div className="flex gap-8 mt-2 text-xs text-gray-300">
            <span>Page</span>
            <span>Group</span>
          </div>
        </div>
      </div>

      {/* đường kẻ + bản quyền */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/20" />
      </div>
      <div className="text-center text-gray-300 text-sm py-4">
        2016 - 2025 © KhungHinh. All rights reserved.
      </div>
    </footer>
  );
}
