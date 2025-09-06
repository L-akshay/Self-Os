import { useState , useMemo, use, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid';
import JournalSidebar from '../components/JournalSidebar';
import JournalEditor from '../components/JournalEditor';
import { db } from '../Firebase/config';
import {collection,onSnapshot,query,orderBy, deleteDoc} from "firebase/firestore";
import { useAuth } from '../contexts/authContext/authContext';
import {  doc,updateDoc,addDoc, serverTimestamp } from 'firebase/firestore';
import { useDebounceCallback } from '../hooks/useDebounce';
function Journal() {
  function firstLine(text = "") {
  const l = text.split("\n").find(x => x.trim()) || "";
  return l.trim().slice(0, 30) || "Untitled";
}
  const saveContent=useDebounceCallback(async (id,text)=>{
    const ref=doc(db,"users",user.uid,"journals",id);
    await updateDoc(ref,{
      content:text,
      titleCache:firstLine(text),
      updatedAt:serverTimestamp(),
    })
  },600);
  const {user}=useAuth();
  useEffect(()=>{
    if(!user) return;
  
  const colRef=collection(db,"users",user.uid,"journals");
  const q=query(colRef,orderBy("updatedAt","desc"));
  const unsub = onSnapshot(q,(snap)=>{
    const rows = snap.docs.map(d=>({id:d.id,...d.data()}));
    setJournals(rows);
 
  if (!setSelectedJournalId && rows.length){
    setSelectedJournalId(rows[0].id);
  }
  });
    return unsub;
},[user?.id]);
  async function handleSaveNow(text) {
    if(!user || !selectedJournalId) return ;
    const ref =doc(db,"users",user.uid,"journals",selectedJournalId);
    await updateDoc(ref,{
      content: text,
      titleCache:firstLine(text),
      updatedAt:serverTimestamp(),
    });

    
  }
  async function deleteContent() {
    const ok=confirm("Delete this journal? This cannot be undone.");
    if(!ok) return;
    const ref =doc(db,"users",user.uid,"journals",selectedJournalId);
    await deleteDoc(ref);
    const remaining = journals.filter(j => j.id !== selectedJournalId);
    setJournals(remaining);
    setSelectedJournalId(remaining[0]?.id || null);
  }


  const[journals,setJournals]=useState([]);
  const[selectedJournalId,setSelectedJournalId]=useState(null);
  async function handleNewJournal() {
  try {
    if (!user) {
      console.warn("No user — are you logged in?");
      return;
    }
    console.log("Creating journal for uid:", user.uid);

    const colRef = collection(db, "users", user.uid, "journals");
    console.log("Collection path:", colRef.path); // should be users/<uid>/journals

    const docRef = await addDoc(colRef, {
      date: new Date().toLocaleDateString(),
      content: "",
      titleCache: "Untitled",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Created doc id:", docRef.id);
    setSelectedJournalId(docRef.id);
  } catch (e) {
    console.error("addDoc failed:", e);
    alert("Error creating journal: " + (e?.message || e));
  }
}

  
  function handleChangeContent(nextText){
    if(!selectedJournalId) return;
    saveContent(selectedJournalId,nextText)
  }
  const selectedJournal=useMemo(
    () => journals.find(j=>j.id===selectedJournalId) || null,
    [journals,selectedJournalId]
  )

  
  return (
    <div className='min-h-screen flex bg-[#0d1117] text-white'>
      <div className='w-1/4 border-r border-gray-800 p-4'>
      <JournalSidebar 
      journals={journals}
      onNewJournal={handleNewJournal}
      selectedJournalId={selectedJournalId}
      onSelect={setSelectedJournalId}      
      />


      </div>
      <div className='w-3/4 p-6'>
      <JournalEditor
       journal={selectedJournal}
       onChangeContent={handleChangeContent}
       onSaveNow={handleSaveNow}
       onDelete={deleteContent}
      
      
      
      
      />

      

      </div>

    </div>
  )
}

export default Journal