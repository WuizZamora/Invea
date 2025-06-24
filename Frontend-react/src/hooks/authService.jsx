import { showError } from '../utils/alerts';
import Swal from 'sweetalert2';

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

export const logoutUser = async (username) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}/auth/logout`,
      {
        method: 'POST',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      }
    );

    if (!res.ok) {
      throw new Error('Error al cerrar sesión');
    }

    await Swal.fire({
      icon: 'info',
      title: 'Hasta luego',
      text: 'Has cerrado sesión correctamente',
      timer: 2000,
      showConfirmButton: false,
    });

    return true;
  } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo cerrar sesión',
      });
    return false;
  }
};
