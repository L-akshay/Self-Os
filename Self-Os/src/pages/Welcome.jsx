import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/authContext/authContext";
import { getQuote } from "../utils/gemini";
import { use, useEffect } from "react";
import { useState } from "react";
import Typewriter from 'typewriter-effect';
import waves from "../assets/waves.svg"
import { getDailyvibe } from "../utils/gemini";

function Welcome(){
  const navigate = useNavigate(); 
  const [quote, setQuote] = useState('Thinking..');
  const[vibe,setVibe]=useState('Today is a new opportunity to move closer to the life you want.')

  
  useEffect(()=>{
    const fetchquote=async()=>{
      const quote=await getQuote();
      setQuote(quote);
    };
    fetchquote();

  },[])
  useEffect(()=>{
    const fetchvibe=async()=>{
      const res=await getDailyvibe();
      setVibe(res)
    };
    fetchvibe();

  },[]) 

  const {user}=useAuth();
  return(
     <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden relative">
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[20vh] mt-16">
        <h1 className="text-3xl font-semibold mb-4">
          Hi { user?.displayName || user?.email} 👋
        </h1>
  <div className="text-gray-400 text-center text-lg mt-2">
  {quote !== 'Thinking..' ? (
    <Typewriter
      key={quote} // ensures it re-renders on change
      onInit={(typewriter) => {
        typewriter.typeString(quote).start();
      }}
      options={{
        autoStart: true,
        loop: false,
        delay: 50,
      }}
    />
  ) : (
    <span>Thinking...</span> // basic fallback
  )}
</div>

      </div>

      <div className="mt-10 px-4 text-left max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">✨ Daily Vibe</h2>
      <p className="text-gray-400 text-sm">{vibe}</p>
      </div>
        <button
        aria-label="Open journal"
        onClick={() => navigate("/journal")}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full
                   grid place-items-center bg-indigo-600 hover:bg-indigo-700
                   shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        title="Open Journal"
      >
        ✍️
      </button>

     
    </div>
  )
}
export default Welcome;
