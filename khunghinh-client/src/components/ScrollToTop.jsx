import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Cuộn lên đầu trang mỗi khi pathname hoặc query (search) thay đổi */
export default function ScrollToTop({ smooth = false }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // nếu có hash (#anchor) thì để trình duyệt xử lý anchor
    if (hash) return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? "smooth" : "instant",
    });
  }, [pathname, search, hash]);

  return null;
}
