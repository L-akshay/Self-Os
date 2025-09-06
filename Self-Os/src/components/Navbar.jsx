import { Link } from "react-router-dom";

function Navbar(){
  return(
  <nav className="w-full px-8 py-4 bg-[#0d1117] text-white flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold tracking-wide">SELF<span className="text-indigo-500">OS</span></div>


    <div className="space-x-6 text-sm font-medium hidden md:flex">
      <Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link>
      <Link to="/goals" className="hover:text-indigo-400">Goals</Link>
      <Link to="/mood"  className="hover:text-indigo-400">Mood</Link>
      <Link to="/productivity" className="hover:text-indigo-400">Productivity</Link>
      <Link to="/insights" className="hover:text-indigo-400">Insights</Link>
    </div>

     <div className="flex items-center gap-4">
        <button className="relative">
          <img
            src="https://www.svgrepo.com/show/512108/bell.svg"
            alt="bell"
            className="w-5 h-5"
          />
        </button>
        <img
          src="https://i.pravatar.cc/300"
          alt="user avatar"
          className="w-8 h-8 rounded-full border border-gray-600"
        />
      </div>

  </nav>
  );
}
export default Navbar;