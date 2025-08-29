export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } }
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        marquee: 'marquee 18s linear infinite'
      },
      backgroundImage: {
        'mesh': 'radial-gradient(20% 20% at 10% 10%, #dbeafe 0, transparent 60%), radial-gradient(20% 20% at 90% 10%, #ede9fe 0, transparent 60%), radial-gradient(30% 30% at 50% 90%, #e0e7ff 0, transparent 60%)'
      }
    }
  },
  plugins: [],
}
