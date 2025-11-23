import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import HamburgerButton from "./HamburguerButton";
import { Outlet } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import Header from "./Header";

export default function PrivateLayout() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const token = useAuthStore((state) => state.token);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (token) fetchUser();
  }, [token, fetchUser]);

  return (
    <div className="flex">

      <Sidebar isOpen={isOpen} />

      <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Conteúdo */}
      <div className="flex-1 relative z-[1]">
        <Header />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
