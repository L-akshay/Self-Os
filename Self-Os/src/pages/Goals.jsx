import React, { useMemo, useState } from "react"

// ---- tiny UI helpers (no external libs) ----
const Badge = ({ children, tone = "zinc" }) => {
  const map = {
    red:   "bg-red-500/15 text-red-300 ring-1 ring-red-500/20",
    amber: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20",
    zinc:  "bg-zinc-700/40 text-zinc-200 ring-1 ring-zinc-600/40",
    green: "bg-green-500/15 text-green-300 ring-1 ring-green-500/20",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[tone]}`}>{children}</span>
  )
}

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 rounded bg-zinc-800">
    <div className="h-full rounded bg-white/70" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
)

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`h-5 w-9 rounded-full transition ${
      checked ? "bg-green-500/70" : "bg-zinc-700"
    } relative`}
  >
    <span
      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
        checked ? "left-4" : "left-0.5"
      }`}
    />
  </button>
)

// ---- Page ----
export default function Goals() {
  const [draft, setDraft] = useState("")
  const [tab, setTab] = useState("all")
  const [goals, setGoals] = useState([
    { id: "1", title: "Finish SelfOS Goals page", status: "open", priority: "high", due: "2025-09-10", progress: 35 },
    { id: "2", title: "Polish Journal UI", status: "done", priority: "med", due: "2025-09-02", progress: 100 },
  ])

  const filtered = useMemo(
    () => goals.filter(g => (tab === "all" ? true : g.status === tab)),
    [goals, tab]
  )
  const counts = {
    all: goals.length,
    open: goals.filter(g => g.status === "open").length,
    done: goals.filter(g => g.status === "done").length,
  }

  // local update helpers (replace with Firestore later)
  const addGoal = () => {
    const t = draft.trim()
    if (!t) return
    setGoals([{ id: Date.now(), title: t, status: "open", priority: "low", due: "", progress: 0 }, ...goals])
    setDraft("")
  }
  const patch = (id, p) => setGoals(gs => gs.map(g => (g.id === id ? { ...g, ...p } : g)))
  const remove = (id) => setGoals(gs => gs.filter(g => g.id !== id))

  const priorityTone = p => (p === "high" ? "red" : p === "med" ? "amber" : "zinc")

  return (
    <div className="min-h-screen bg-[#0b0f16] text-zinc-100">
      <div className="mx-auto max-w-5xl px-5 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
            <p className="text-zinc-400 text-sm">Plan it. Track it. Ship it.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Badge tone="zinc">All: {counts.all}</Badge>
            <Badge tone="amber">Open: {counts.open}</Badge>
            <Badge tone="green">Done: {counts.done}</Badge>
          </div>
        </div>

        {/* Add bar */}
        <div className="mb-4 flex gap-2">
          <input
            className="flex-1 rounded-xl bg-zinc-900/70 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            placeholder="Add new goal and hit Enter…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addGoal()}
          />
          <button
            onClick={addGoal}
            className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 font-medium"
          >
            Add
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-3 flex gap-2">
          {["all", "open", "done"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm border ${
                tab === t ? "bg-white/10 border-white/20" : "bg-transparent border-zinc-800 hover:bg-white/5"
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-sm font-medium text-zinc-300 border-b border-zinc-800">
            <div className="col-span-6">Title</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Due</div>
            <div className="col-span-1">Progress</div>
            <div className="col-span-1 text-right">Status</div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center text-zinc-500">No goals in this tab.</div>
          ) : (
            <ul className="divide-y divide-zinc-900/80">
              {filtered.map(g => {
                const overdue = g.status === "open" && g.due && new Date(g.due) < new Date()
                return (
                  <li key={g.id} className={`grid grid-cols-12 gap-3 px-4 py-3 items-center ${overdue ? "bg-red-500/5" : ""}`}>
                    {/* Title */}
                    <div className="col-span-6">
                      <input
                        value={g.title}
                        onChange={e => patch(g.id, { title: e.target.value })}
                        className="w-full rounded-lg bg-transparent border border-zinc-800 px-3 py-1.5 outline-none focus:border-zinc-600"
                      />
                      <div className="mt-1 hidden md:block">
                        <ProgressBar value={g.progress} />
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="col-span-2">
                      <select
                        value={g.priority || "low"}
                        onChange={e => patch(g.id, { priority: e.target.value })}
                        className="w-[120px] rounded-lg bg-zinc-900/70 border border-zinc-800 px-2 py-1.5 outline-none focus:border-zinc-600"
                      >
                        <option value="low">Low</option>
                        <option value="med">Med</option>
                        <option value="high">High</option>
                      </select>
                      <div className="mt-1">
                        <Badge tone={priorityTone(g.priority || "low")}>{g.priority || "low"}</Badge>
                      </div>
                    </div>

                    {/* Due */}
                    <div className="col-span-2">
                      <input
                        type="date"
                        value={g.due || ""}
                        onChange={e => patch(g.id, { due: e.target.value })}
                        className="rounded-lg bg-zinc-900/70 border border-zinc-800 px-2 py-1.5 outline-none focus:border-zinc-600"
                      />
                      {overdue && <div className="mt-1 text-xs text-red-400">Overdue</div>}
                    </div>

                    {/* Progress (compact on mobile) */}
                    <div className="col-span-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={g.progress}
                        onChange={e => patch(g.id, { progress: Math.max(0, Math.min(100, Number(e.target.value))) })}
                        className="w-16 rounded-lg bg-zinc-900/70 border border-zinc-800 px-2 py-1.5 outline-none focus:border-zinc-600"
                      />
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center justify-end gap-2">
                      <Toggle
                        checked={g.status === "done"}
                        onChange={v => patch(g.id, { status: v ? "done" : "open", progress: v ? 100 : g.progress })}
                      />
                      <button
                        onClick={() => remove(g.id)}
                        className="ml-2 rounded-md px-2 py-1 text-xs text-zinc-300 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
