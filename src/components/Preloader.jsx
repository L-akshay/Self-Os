import logo from '../assets/unnamed.png'; // Update with your file name

export default function Preloader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0d0d0d] transition-all duration-1000">
      <img
        src={logo}
        alt="Self OS"
        className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-96 drop-shadow-[0_0_40px_rgba(124,58,237,0.45)]"
      />
    </div>
  );
}
