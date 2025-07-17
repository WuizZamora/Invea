import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UserContext";
import { logoutUser } from "../hooks/authService";
import "../css/Header.css";

const Header = () => {
  const { usuario, setUsuario, loading } = useUsuario();
  const navigate = useNavigate();
  const [anuncio, setAnuncio] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}/deva/anuncio`, {
      credentials: 'include'
    })
      .then((res) => (res.status === 204 ? null : res.json()))
      .then((data) => {
        if (data?.mensaje) setAnuncio(data.mensaje);
      })
      .catch((err) => console.error("Error al cargar anuncio", err));
  }, []);

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
                  <Link to="/chat">Soporte</Link>
                  <Link to="/consulta">Consulta</Link>
                  <Link to="/captura">Captura</Link>
                  <Link to="/turnado">Turnado</Link>
                  <Link to="/sub">Sub</Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      {anuncio && (
        <div className="anuncio-banner text-center py-1" style={{ backgroundColor: "#ffefc1", color: "#333" }}>
          {anuncio}
        </div>
      )}

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
