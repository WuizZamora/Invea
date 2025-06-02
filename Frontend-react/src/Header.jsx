import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <img src="/INVEAlogo.png" alt="Logo" class="logo"/>
      {/* <nav className="nav">
        <Link to="/entrada">Entrada</Link>
        <Link to="/salida">Salida</Link>
      </nav> */}
    </header>
  );
};

export default Header;
