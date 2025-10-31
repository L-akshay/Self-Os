// Layout.jsx
import { useEffect, useState } from "react"
import Header from "./Header"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0F16] text-white">
      <Header scrolled={scrolled} />
      {/* push content below the fixed header height (h-16 = 4rem) */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
