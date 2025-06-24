import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsuario = () => useContext(UserContext);
