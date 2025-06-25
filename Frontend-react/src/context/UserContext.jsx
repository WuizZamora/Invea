import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // <- NUEVO

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}/auth/check-session`, {
      credentials: "include",
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.state) {
          setUsuario({
            nombre: data.nombre,
            username: data.usuario,
            nivel: data.nivel,
            id: data.id
          });
        }
      })
      .finally(() => setLoading(false)); // <- MARCA que ya cargó
  }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsuario = () => useContext(UserContext);