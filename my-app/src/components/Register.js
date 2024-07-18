import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(username)) {
      toast.error('Dirección de correo no válida');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula y un número');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-12 col-md-6">
        <h2>Registro</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Usuario (Correo electrónico)</label>
            <input
              type="email"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
        <Link to="/login" className="d-block mt-3 text-center">Iniciar sesión</Link>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
