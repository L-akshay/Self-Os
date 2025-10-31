
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext/authContext";
import { db } from "../Firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ----------------------- Tiny UI bits ----------------------- */

const IntensityBar = ({ intensity, setIntensity }) => (
  <input
    type="range"
    min={1}
    max={100}
    value={intensity}
    onChange={(e) => setIntensity(Number(e.target.value))}
    className="w-full accent-blue-500"
  />
);

const Textarea = ({ note, setNote }) => (
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Add your note here..."
    className="w-full h-24 p-2 rounded-lg bg-[#232838] text-white border border-[#282E39] focus:outline-none focus:ring-2 focus:ring-[#135bec]/80 resize-none"
  />
);

/* ----------------------- Helpers ----------------------- */

const EMOJI_SET = [
  { score: 1, emoji: "😠", label: "Low" },
  { score: 2, emoji: "😔", label: "Down" },
  { score: 3, emoji: "😐", label: "Neutral" },
  { score: 4, emoji: "😊", label: "Good" },
  { score: 5, emoji: "😄", label: "Great" },
];

const byScore = (s) =>
  EMOJI_SET.find((e) => e.score === s) || { emoji: "😐", label: "Neutral" };

// local-day safe YYYY-MM-DD
const getDateKey = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const toLocalKey = (dateObj) => {
  const d = new Date(dateObj);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} day${d > 1 ? "s" : ""} ago`;
  if (h > 0) return `${h} hour${h > 1 ? "s" : ""} ago`;
  if (m > 0) return `${m} min ago`;
  return "just now";
};

// average score for each of the last 14 local days
const buildLast14Days = (entries) => {
  const map = new Map();
  for (const e of entries) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date).push(e.score);
  }
  const out = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = toLocalKey(d);
    const arr = map.get(key);
    const avg = arr ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    out.push({ date: key, value: avg });
  }
  return out;
};

/* ----------------------- Recharts line ----------------------- */

const MoodLineChart = ({ data }) => {
  const rows = data.map((d) => ({
    day: d.date.slice(5), // 'MM-DD'
    value: d.value,
  }));

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid stroke="#232838" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            minTickGap={12}
          />
          <YAxis domain={[1, 5]} hide />
          <Tooltip
            contentStyle={{
              background: "#0F121A",
              border: "1px solid #232838",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(v) => [Number(v).toFixed(1), "Mood"]}
            labelFormatter={(l) => `Day: ${l}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ----------------------- History list ----------------------- */

const HistoryList = ({ entries, onDelete }) => {
  if (!entries.length) return <div className="text-sm text-zinc-500">No entries yet.</div>;

  const list = [...entries].sort((a, b) =>
    a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date)
  );

  return (
    <ul className="space-y-3">
      {list.map((e) => (
        <li
          key={e.id}
          className="flex items-start justify-between rounded-xl border border-[#232838] bg-[#0F121A] p-4"
        >
          <div className="flex gap-3">
            <div className="text-2xl">{byScore(e.score).emoji}</div>
            <div>
              <div className="font-medium">{byScore(e.score).label}</div>
              {e.note && <div className="text-sm text-zinc-400">Note: {e.note}</div>}
              <div className="text-xs text-zinc-500 mt-1">{timeAgo(e.createdAt)}</div>
            </div>
          </div>
          <button
            onClick={() => onDelete(e.id)}
            className="text-sm text-zinc-400 hover:text-red-400"
            aria-label="Delete entry"
            title="Delete"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
};


const Moods = () => {
  const { user } = useAuth();

  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(null);
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoaded(true);
      return;
    }
    const colRef = collection(db, "users", user.uid, "moods");
    const q = query(colRef, orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const x = d.data();
        return {
          id: d.id,
          ...x,
          createdAt: x.createdAt?.toMillis?.() ?? Date.now(),
          updatedAt: x.updatedAt?.toMillis?.() ?? Date.now(),
        };
      });
      setEntries(list);
      setLoaded(true);
    });
    return unsub;
  }, [user]);

  const saveToday = async () => {
    if (!user || score == null) return;
    const datekey = getDateKey();
    const ref = doc(db, "users", user.uid, "moods", datekey);
    await setDoc(
      ref,
      {
        date: datekey,
        score,
        intensity,
        note: note?.trim() || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setNote("");
    
  };

  const handleDelete = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "moods", id));
  };

  const todayKey = getDateKey();
  const todayEntry = entries.find((e) => e.date === todayKey);
  const selectedScore = score ?? todayEntry?.score ?? 3;

  return (
    <main className="min-h-[100dvh] bg-[#0D0F14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Mood Tracker</h1>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Left: Quick Log */}
          <section className="lg:col-span-1 rounded-2xl border border-[#232838] bg-[#151822] p-5 shadow-lg min-h-[500px]">
            <h2 className="text-lg font-medium mb-1">Quick Log</h2>
            <p className="text-sm text-zinc-400 mb-5">How are you feeling right now?</p>

            <h2 className="text-lg font-medium mb-5">Select Your Mood</h2>
            <div className="flex flex-nowrap justify-center gap-3">
              {EMOJI_SET.map((m) => {
                const active = score === m.score;
                return (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => setScore(m.score)}
                    title={m.label}
                    aria-pressed={active}
                    className={[
                      "h-14 w-14 grid place-items-center rounded-full",
                      "transition-transform duration-150 hover:scale-105",
                      active
                        ? "ring-2 ring-[#135bec]/80 ring-offset-2 ring-offset-[#151822] bg-[#282E39]"
                        : "hover:bg-[#282E39]/60",
                      "focus:outline-none focus:ring-2 focus:ring-[#135bec]/80 focus:ring-offset-2 focus:ring-offset-[#151822]",
                    ].join(" ")}
                  >
                    <span className="text-3xl leading-none select-none">{m.emoji}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="text-lg font-medium mb-5 pt-5">Intensity</h2>
            <div className="mt-1">
              <IntensityBar intensity={intensity} setIntensity={setIntensity} />
              <p className="text-sm text-zinc-400 mt-2">Current intensity: {intensity}</p>
            </div>

            <h2 className="text-lg font-medium mb-5 pt-3">Add a note (optional)</h2>
            <Textarea note={note} setNote={setNote} />

            <button
              onClick={saveToday}
              className="mt-4 w-full bg-[#1f69fc] hover:bg-[#0f4aa3] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50"
              disabled={score == null || !user}
            >
              Save
            </button>
          </section>

          {/* Right: Today + History */}
          <section className="lg:col-span-2 grid gap-6 grid-rows-[auto_1fr]">
            {/* Today */}
            <div className="rounded-2xl border border-[#232838] bg-[#151822] p-5 shadow-lg">
              <h3 className="text-lg font-medium mb-3">Today</h3>
              <div className="flex flex-col items-center gap-3">
                {!loaded ? (
                  <div className="text-zinc-500">Loading...</div>
                ) : (
                  <>
                    <div className="text-6xl">{byScore(selectedScore).emoji}</div>
                    <p className="text-sm text-zinc-400">{byScore(selectedScore).label}</p>
                    <div className="mt-4 w-full">
                      <MoodLineChart data={buildLast14Days(entries)} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* History */}
            <div className="rounded-2xl border border-[#232838] bg-[#151822] p-5 shadow-lg overflow-auto">
              <h3 className="text-lg font-medium mb-3">History</h3>
              <HistoryList entries={entries} onDelete={handleDelete} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Moods;
