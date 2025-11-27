import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/auth-store";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const { user, clearAuthData } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    clearAuthData();
    window.location.href = "/";
  };

  // FECHAR ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed top-7 right-5 z-50">
        <div className="relative" ref={menuRef}>
          
          {/* BOTÃO */}
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-3
              bg-white/20 hover:bg-white/30 px-3 py-2 rounded-full backdrop-blur-sm transition
              sm:flex
              max-sm:bg-transparent max-sm:px-0 max-sm:py-0
            "
          >
            {/* FOTO — maior no mobile */}
            <img
              src={
                user?.picture ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.nome || "User")
              }
              alt="perfil"
              className="
                w-10 h-10
                max-sm:w-14 max-sm:h-14
                rounded-full object-cover bg-white
              "
            />

            {/* NOME — some no mobile */}
            <span className="hidden sm:inline font-semibold text-white text-2xl">
              {user ? user.nome : "Carregando..."}
            </span>

            {/* SETA — some no mobile */}
            <FiChevronDown className="text-white w-6 h-6 mt-1 hidden sm:block" />
          </button>

          {/* MENU */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-base font-semibold">{user?.nome}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-100 text-red-600"
              >
                <FiLogOut /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
