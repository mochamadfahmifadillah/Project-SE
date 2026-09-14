import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/public/Header";
import Footer from "../components/public/Footer";

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="app-shell">
      <Header onMenu={() => setOpen(!open)} />

      {open && (
        <div className="mobile-nav">
          <button onClick={() => handleNavigate("/software")}>Software</button>

          <button onClick={() => handleNavigate("/compare")}>Compare</button>

          <button onClick={() => handleNavigate("/recommend")}>
            Find My Software
          </button>

          <button onClick={() => handleNavigate("/account")}>My Account</button>
        </div>
      )}

      {children}

      <Footer />
    </div>
  );
}
