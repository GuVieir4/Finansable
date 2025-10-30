import { useState } from "react";
import Toast from "./Toast";
import { Link } from "react-router-dom";

export default function Header() {
  const [showToast, setShowToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleBellClick() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="relative flex items-center justify-between border-b border-[#000000] px-6 py-3 md:px-10">
      <Link to="/">
        <div className="flex items-center gap-3 text-[#131711]">
          <img src="porquinho.png" alt="Logo Finansable" className="w-7 md:w-9" />
          <h2 className="text-[#264533] text-2xl font-bold">Finansable</h2>
        </div>
      </Link>

      <button onClick={() => setMenuOpen(true)} className="sm:hidden text-[#264533] text-2xl">
        <i className="fa-solid fa-bars"></i>
      </button>

      <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-[#264533]">
        <Link to="/">Dashboard</Link>
        <Link to="/chatbot">Chatbot</Link>
        <Link to="/transactions">Transações</Link>
        <Link to="/goals">Metas</Link>
        <Link to="/reports">Relatórios</Link>
        <Link to="/plans">Planos</Link>
      </nav>

      <div className="hidden sm:flex items-center gap-4">
        <button onClick={handleBellClick} className="flex items-center justify-center h-9 w-9 bg-[#264533] rounded-lg text-white">
          <i className="fa-regular fa-bell"></i>
        </button>

        <div className="rounded-full size-10 bg-center bg-cover" style={{ backgroundImage: 'url("https://avatars.githubusercontent.com/u/160288170?v=4")' }}></div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeMenu}/>
      )}

      <div className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-6 shadow-[0_-8px_20px_rgba(0,0,0,0.2)] transition-transform duration-300 ${menuOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="w-10 h-[4px] bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="rounded-full size-16 bg-center bg-cover"  style={{ backgroundImage: 'url("https://avatars.githubusercontent.com/u/160288170?v=4")' }}></div>
        </div>

        <nav className="flex flex-col items-center gap-5 text-[#264533] text-lg font-medium">
          <Link onClick={closeMenu} to="/">Dashboard</Link>
          <Link onClick={closeMenu} to="/chatbot">Chatbot</Link>
          <Link onClick={closeMenu} to="/transactions">Transações</Link>
          <Link onClick={closeMenu} to="/goals">Metas</Link>
          <Link onClick={closeMenu} to="/reports">Relatórios</Link>
          <Link onClick={closeMenu} to="/plans">Planos</Link>
        </nav>

        <button onClick={() => { handleBellClick(); closeMenu(); }} className="mt-6 flex items-center justify-center h-10 w-full bg-[#264533] rounded-lg text-white">
          <i className="fa-regular fa-bell"></i>
        </button>
      </div>

      {showToast && <Toast onClose={() => setShowToast(false)} />}
    </header>
  );
}
