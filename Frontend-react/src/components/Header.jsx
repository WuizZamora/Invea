import React from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../hooks/authService";
import "../css/Header.css";

const Header = () => {
  const { usuario, setUsuario, loading } = useUsuario();
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    const ok = await logoutUser(usuario?.username);
    if (ok) {
      setUsuario(null);
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="header d-flex justify-content-between align-items-center px-4 py-2">
      <div className="d-flex align-items-center gap-3">
        <img src="/INVEAlogo.png" alt="Logo" className="logo" />
        {!loading && usuario?.nivel === 1 && (
          <nav className="nav">
            <div className="dropdown">
              <span className="dropdown-title">DEVA</span>
              <div className="dropdown-content">
                <Link to="/consulta">Consulta</Link>
                <Link to="/captura">Captura</Link>
                <Link to="/turnado">Turnado</Link>
              </div>
            </div>
          </nav>
        )}
      </div>

      {!loading && usuario && (
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">👤 {usuario.nombre}</span>
          <button
            onClick={cerrarSesion}
            style={{
              backgroundColor: "#9f2241",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer"
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
