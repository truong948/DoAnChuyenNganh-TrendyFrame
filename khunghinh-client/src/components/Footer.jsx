import { Globe, Facebook, UsersRound } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-16 text-white">
      {/* Background layer: gradient + subtle glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#233246] via-[#1f2a3a] to-[#101826]" />
      <div className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-24 opacity-70 blur-2xl [background:radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Cột 1: Logo + ngôn ngữ */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/15 ring-1 ring-white/20 grid place-items-center text-lg shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <span>📄</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">Khunghinh</span>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Đổi ngôn ngữ"
              type="button"
            >
              <Globe className="h-4 w-4" />
              Tiếng Việt <span aria-hidden className="opacity-70">▾</span>
            </button>

            <p className="text-sm text-white/70 leading-relaxed">
              Tạo & quản lý khung hình trực tuyến. Nhanh, nhẹ, thân thiện.
            </p>
          </div>

          {/* Cột 2: Khunghinh */}
          <nav aria-label="Khunghinh" className="text-sm">
            <h3 className="mb-3 font-semibold tracking-wide text-white/90">Khunghinh</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </nav>

          {/* Cột 3: Công cụ */}
          <nav aria-label="Công cụ" className="text-sm">
            <h3 className="mb-3 font-semibold tracking-wide text-white/90">Công cụ</h3>
            <ul className="space-y-2">
              <li>
                <a href="/editor" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Tạo khung hình
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Xóa nền
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Tạo vùng trong suốt
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Nén hình ảnh
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                  Thay đổi kích thước
                </a>
              </li>
            </ul>
          </nav>

          {/* Cột 4: Theo dõi */}
          <div className="text-sm">
            <h3 className="mb-3 font-semibold tracking-wide text-white/90">Theo dõi chúng tôi</h3>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook Page"
                className="group rounded-full p-3 ring-1 ring-white/20 bg-white/10 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <Facebook className="h-5 w-5 transition group-hover:scale-110" />
              </a>
              <a
                href="#"
                aria-label="Facebook Group"
                className="group rounded-full p-3 ring-1 ring-white/20 bg-white/10 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <UsersRound className="h-5 w-5 transition group-hover:scale-110" />
              </a>
            </div>
            <div className="mt-2 flex gap-8 text-xs text-white/70">
              <span>Page</span>
              <span>Group</span>
            </div>
          </div>
        </div>

        {/* đường kẻ + bản quyền */}
        <div className="mt-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="mt-4 text-center text-sm text-white/80">
            <p>
              2016–{year} © <span className="font-semibold">KhungHinh</span>. All rights reserved.
            </p>
            <p className="mt-1 text-white/70">
              Thiết kế & phát triển bởi <span className="font-medium">Nguyễn Lê Quốc Lâm</span> & <span className="font-medium">Nguyễn Văn Trường</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
