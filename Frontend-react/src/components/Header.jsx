import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  return (
    <header className="header">
      <img src="/INVEAlogo.png" alt="Logo" className="logo" />
      
      <nav className="nav">
        <div className="dropdown">
          <span className="dropdown-title">DEVA</span>
          <div className="dropdown-content">
            <Link to="/consulta">Consulta</Link>
            <Link to="/captura">Captura</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
