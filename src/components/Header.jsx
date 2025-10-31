
export default function Header({ scrolled }) {
  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 h-16",                 // fixed bar
        "flex items-center justify-between px-6",
        scrolled
          ? "bg-[#0D0F14]/80 backdrop-blur ring-1 ring-white/10" // on-scroll style
          : "bg-transparent"
      ].join(" ")}
    >
      {/* left: logo */}
      <div className="font-semibold">SELF<span className="text-indigo-400">OS</span></div>

      {/* center: nav */}
      <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
        <a href="/dashboard">Dashboard</a>
        <a href="/goals">Goals</a>
        <a href="/mood" className="text-white">Mood</a>
    
        <a href="/insights">Insights</a>
      </nav>

      {/* right: avatar etc. */}
      <div className="w-8 h-8 rounded-full bg-zinc-700" />
    </header>
  )
}
