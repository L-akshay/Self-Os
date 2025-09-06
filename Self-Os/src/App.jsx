import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Preloader from "./components/Preloader";
import {Routes,Route} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import Journal from "./pages/Journal";
import Goals from "./pages/Goals";


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Preloader */}
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-1000 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Preloader />
      </div>

      {/* Main Content */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/goals" element={< Goals/>} />

        </Routes>
      </div>
    </div>
    
  );
}

export default App;
