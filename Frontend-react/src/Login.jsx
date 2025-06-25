import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginUser } from './hooks/authService';
import './css/Login.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { useUsuario } from './context/UserContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const { setUsuario } = useUsuario();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(formData);

    if (result) {
        setUsuario({
          nombre: result.nombre,
          username: result.usuario,
          nivel: result.nivel,
          id: result.id
        });

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión exitoso',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        const rutas = {
          1: '/admin',
          2: '/turnado',
          3: '/consulta'
        };
        navigate(rutas[result.nivel] || '/123');
      });
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Lado izquierdo: Logo */}
        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center">
          <img src="/logo-cdmx.png" alt="Logo" style={{ maxWidth: '60%' }} />
        </div>

        {/* Lado derecho: Formulario */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center px-5">
          <h2 className="animated-text mb-4 text-center">¡Bienvenido de nuevo!</h2>

          <form className="w-100" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control form-control-sm mb-3"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
                type={showPassword ? 'text' : 'password'}
                className="form-control form-control-sm pe-5" // pe-5 para dar espacio al ícono a la derecha
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
              <i
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
                onClick={togglePassword}
                style={{
                  top: '70%',
                  right: '15px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#6c757d',
                  fontSize: '1.25rem' // opcional, para mejor tamaño
                }}
              ></i>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg mt-3 d-block mx-au"
            style={{backgroundColor: '#9f2241'}}
            >Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
