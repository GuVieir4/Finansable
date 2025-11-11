import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Toast from "./Toast";
import { LogOut, User, Settings } from "lucide-react";

void motion;

export default function Header() {
  const [showToast, setShowToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const profileRef = useRef(null);
  const location = useLocation();

  function handleBellClick() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    ["Dashboard", "/"],
    ["Chatbot", "/chatbot"],
    ["Transações", "/transactions"],
    ["Metas", "/goals"],
    ["Relatórios", "/reports"],
    ["Planos", "/plans"],
  ];

  return (
    <header className="relative flex items-center justify-between border-b border-[#000000]/20 px-6 py-3 md:px-10 bg-white shadow-sm">
      <Link to="/" className="flex items-center gap-3 text-[#131711] group">
        <motion.img
          src="porquinho.png"
          alt="Logo Finansable"
          className="w-8 md:w-10"
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.6 },
          }}
        />
        <motion.h2
          className="text-[#264533] text-2xl font-bold tracking-tight"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Finansable
        </motion.h2>
      </Link>

      <button
        onClick={() => setMenuOpen(true)}
        className="sm:hidden text-[#264533] text-2xl"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-[#264533] relative">
        {links.map(([label, link]) => {
          const isActive = location.pathname === link;
          return (
            <div
              key={label}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered("")}
              className="relative cursor-pointer"
            >
              <Link
                to={link}
                className={`transition-colors ${
                  isActive ? "text-[#2d6a4f]" : "hover:text-[#2d6a4f]"
                }`}
              >
                {label}
              </Link>
              <AnimatePresence>
                {(hovered === label || isActive) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 h-[2px] bg-[#2d6a4f] rounded-full"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="hidden sm:flex items-center gap-4 relative">
        <motion.button
          onClick={handleBellClick}
          className="flex items-center justify-center h-9 w-9 bg-[#264533] rounded-lg text-white hover:bg-[#2d6a4f] transition-all"
          whileHover={{ rotate: [-5, 5, -5, 0], scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <i className="fa-regular fa-bell"></i>
        </motion.button>

        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setProfileOpen((prev) => !prev)}
            className="rounded-full size-10 bg-center bg-cover ring-2 ring-[#264533]/20 hover:ring-[#2d6a4f] transition-all"
            style={{
              backgroundImage:
                'url("https://avatars.githubusercontent.com/u/160288170?v=4")',
            }}
          ></motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
              >
                <button className="flex items-center gap-2 w-full px-4 py-2 text-[#264533] hover:bg-[#f0fdf4] transition-colors">
                  <User className="w-4 h-4 text-[#2d6a4f]" /> Perfil
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-[#264533] hover:bg-[#f0fdf4] transition-colors">
                  <Settings className="w-4 h-4 text-[#2d6a4f]" /> Configurações
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-[#c92a2a] hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4 text-[#c92a2a]" /> Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-6 shadow-[0_-8px_20px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
          menuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-10 h-[4px] bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="flex flex-col items-center gap-2 mb-5">
          <div
            className="rounded-full size-16 bg-center bg-cover"
            style={{
              backgroundImage:
                'url("https://avatars.githubusercontent.com/u/160288170?v=4")',
            }}
          ></div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <button className="flex items-center gap-2 px-3 py-1 text-[#264533] bg-[#f0fdf4] rounded-lg hover:bg-[#e4f6eb] transition-all text-sm">
              <User className="w-4 h-4 text-[#2d6a4f]" /> Perfil
            </button>
            <button className="flex items-center gap-2 px-3 py-1 text-[#264533] bg-[#f0fdf4] rounded-lg hover:bg-[#e4f6eb] transition-all text-sm">
              <Settings className="w-4 h-4 text-[#2d6a4f]" /> Configurações
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1 text-[#c92a2a] bg-red-50 rounded-lg hover:bg-red-100 transition-all text-sm">
              <LogOut className="w-4 h-4 text-[#c92a2a]" /> Sair
            </button>
          </div>
        </div>

        <nav className="flex flex-col items-center gap-5 text-[#264533] text-lg font-medium">
          {links.map(([label, link]) => (
            <Link
              key={label}
              onClick={closeMenu}
              to={link}
              className={`${
                location.pathname === link
                  ? "text-[#2d6a4f] border-b-2 border-[#2d6a4f]"
                  : "hover:text-[#2d6a4f]"
              } pb-1 transition-all`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            handleBellClick();
            closeMenu();
          }}
          className="mt-6 flex items-center justify-center h-10 w-full bg-[#264533] rounded-lg text-white hover:bg-[#2d6a4f] transition-all"
        >
          <i className="fa-regular fa-bell"></i>
        </button>
      </div>

      {showToast && <Toast onClose={() => setShowToast(false)} />}
    </header>
  );
}