import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}/auth/check-session`, {
      credentials: 'include',
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (data.state === true) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return null; // O un spinner de carga

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
