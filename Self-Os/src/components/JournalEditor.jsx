import React from 'react'
import { useEffect,useState } from 'react'
function JournalEditor({journal,onChangeContent,onSaveNow,onDelete}) {
  const [draft,setDraft]=useState("");
  const[saving,setSaving]=useState(false);
  useEffect(()=>{
    setDraft(journal?.content || "");
  },[journal?.id]);
  if(!journal){
    return (
      <div className="h-full flex items-center justify-center text-gray-400"
      
      >
        Select or create a jounal to start writing.
      </div>
    )
  }
  async function handleSaveClick() {
    try{
      setSaving(true);
      await onSaveNow(draft);
    }
    finally{
      setSaving(false);
    }
    
  }
  const updated =
    journal?.updatedAt?.toDate
      ? journal.updatedAt.toDate().toLocaleString()
      : journal?.createdAt?.toDate
        ? journal.createdAt.toDate().toLocaleString()
        : "just now";

  return (
    <div className='h-full flex flex-col'>
     <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Last updated: {updated}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveClick}
            className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 rounded bg-red-600/90 hover:bg-red-700 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <textarea 
      className='flex-1 w-full bg-transparent outline-none border border-gray-800 rounded p-4 leading-6'
      placeholder='write your thoughts...'
      value={draft}
      onChange={(e)=>{
        const next=e.target.value;
        setDraft(next);
        onChangeContent(next);
      }}
      />
    </div>
  )
}

export default JournalEditor