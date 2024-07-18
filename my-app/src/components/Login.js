import React, { useState } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      setToastMessage(response.data.message);
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 col-lg-4">
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                style={{ width: '100%' }} // Hace que el input ocupe el 100% del ancho del contenedor
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
                style={{ width: '100%' }} // Hace que el input ocupe el 100% del ancho del contenedor
              />
            </div>
            <div className="mb-3">
              <a href="/forgot-password" className="btn btn-link">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </div>
            <div className="text-center">
              <a href="/register" className="btn btn-link">Crear Cuenta</a>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Login;
