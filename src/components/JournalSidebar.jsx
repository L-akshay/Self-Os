export default function JournalSidebar({ journals, selectedJournalId, onNewJournal, onSelect }) {
  return (
    <div className="h-full flex flex-col p-3">
      <button
        onClick={onNewJournal}
        className="w-full text-left p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded mb-4"
      >
        ➕ New Journal
      </button>

      <ul className="space-y-1">
        {journals.map(j => {
          const active = j.id === selectedJournalId;
          return (
            <li
              key={j.id}
              onClick={() => onSelect(j.id)}
              className={`cursor-pointer p-2 rounded border border-transparent hover:bg-gray-800
                         ${active ? "bg-gray-800 border-gray-700" : ""}`}
            >
              <div className="text-sm font-medium">{j.titleCache || "Untitled"}</div>
              <div className="text-[11px] text-gray-400">{j.date}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
