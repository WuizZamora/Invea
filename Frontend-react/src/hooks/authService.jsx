import { showError } from '../utils/alerts';

const API_URL = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}/auth/login`;

export const loginUser = async ({ username, password }) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.state === false) {
      showError(data.state || 'Usuario o contraseña incorrectos');
      return null;

    }return data;

  } catch (err) {
    showError('No se pudo conectar con el servidor');
    return null;
  }
};