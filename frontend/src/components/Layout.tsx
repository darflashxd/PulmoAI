import { Outlet, Link } from 'react-router-dom';
import logoImage from '../assets/Logo.png'; 

export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-montserrat">
      
      {/* Navbar */}
      <nav className="bg-white shadow-[#58C8FF]/20 shadow-md px-5 py-3 md:px-12 xl:px-28 xl:py-4 md:py-4 sticky top-0 z-50">
        <div className="mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0 md:gap-1 xl:gap-1 hover:opacity-75 transition-opacity">
            <img 
                src={logoImage} 
                alt="Logo PulmoAI" 
                className="h-12 w-auto md:h-20 xl:h-20 object-contain" 
            />
            <h1 className="text-sm md:text-xl xl:text-xl font-bold text-[#36D67F] tracking-tight">PulmoAI</h1>
          </Link>

          {/* Menu Link */}
          <div className="flex gap-6 pr-2 md:gap-12 xl:gap-16 text-[0.8rem] md:text-lg xl:text-lg font-semibold text-[#233348]">
            <Link to="/" className="hover:text-[#4D93FF] transition-colors">
              Home
            </Link>
            <Link to="/scan" className="hover:text-[#4D93FF] transition-colors">
              Scanner
            </Link>
          </div>

        </div>
      </nav>

      {/* --- Contents --- */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-bl from-[#67C3F3] to-[#5A98F2] px-6 py-10 md:px-12 md:py-14 xl:px-28 xl:py-16 text-left text-[#e3efff] text-xs">
        <h1 className='font-semibold text-sm md:text-lg xl:text-lg md:py-1 xl:py-1'>PulmoAI</h1>
        <p className='font-medium text-[0.6rem] md:text-sm xl:text-sm pb-1 md:pb-2 xl:pb-2'>© PulmoAI Project 2025. All rights reserved.</p>
        <p className="font-medium text-[0.6rem] md:text-sm xl:text-sm py-1 md:py-2 xl:py-2">This system is an assistive tool, not a replacement for professional medical diagnosis.</p>
      </footer>

    </div>
  );
}