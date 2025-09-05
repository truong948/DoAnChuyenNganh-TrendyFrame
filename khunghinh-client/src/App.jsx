// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Tools from './pages/Tools.jsx'
import Trending from './pages/Trending.jsx'
import Editor from './pages/Editor.jsx'
import Login from './pages/Login.jsx'
import Compress from './pages/Compress.jsx'   // 👈 thêm trang nén ảnh
import ScrollToTop from './components/ScrollToTop.jsx'   // 👈 thêm ScrollToTop

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">   {/* 👈 layout full height */}
        <Navbar />

        {/* nội dung chính chiếm hết phần còn lại */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/compress" element={<Compress />} />
            <Route path="/:alias" element={<Editor />} />
          </Routes>
        </main>

        <Footer />   {/* 👈 sẽ luôn ở cuối */}
      </div>
    </BrowserRouter>
  )
}

