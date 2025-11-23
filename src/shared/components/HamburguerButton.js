import React, { useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";

export default function HamburgerButton({ isOpen, setIsOpen }) {
  const btnRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isOpen) return;
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <button
      ref={btnRef}
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden fixed top-9 left-4 z-[99999999] p-3 
                 active:scale-95 transition"
    >
      <FaBars className="text-2xl text-black" />
    </button>
  );
}
