const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const HEADERS=()=>({
  Authorization:`Bearer ${HF_API_KEY}`,
  "Content-Type": "application/json",
})
export async function Emotion(note) {
  if(!HF_API_KEY) throw new Error("Missing VITE_HF_API_KEY")
    const r =await fetch(
  "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
  {method:"POST",headers:HEADERS(),body:JSON.stringify({
    
    inputs:note,options:{wait_formodel:true}})
  
  }
  
    )
    if(!r.ok) throw new Error("HFemotion error");
    return r.json();  
  
}
export async function ZeroShot(note,labels) {
  if(!HF_API_KEY) throw new Error("Missing VITE_HF_API_KEY")
       const r = await fetch(
    "https://api-inference.huggingface.co/models/MoritzLaurer/deberta-v3-large-zeroshot-v2.0",
    {
      method: "POST",
      headers: HEADERS(),
      body: JSON.stringify({
        inputs: note,
        parameters: { candidate_labels: labels, multi_label: true },
        options: { wait_for_model: true },
      }),
    }
  );
  if (!r.ok) throw new Error("HF zero-shot error");
  return r.json(); // {labels:[], scores:[]}
}
  
