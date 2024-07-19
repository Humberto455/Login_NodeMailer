import React, { useState } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'token'
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setToastMessage(response.data.message);
      setShowToast(true);
      setStep('token'); // Muestra el campo de token
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { token, newPassword });
      setToastMessage(response.data.message);
      setShowToast(true);
      setTimeout(() => {
        navigate('/login'); // Redirige a la página de inicio de sesión después de 1 segundo
      }, 1000);
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 col-lg-4">
          <h2 className="text-center mb-4">{step === 'email' ? 'Recuperar Contraseña' : 'Restablecer Contraseña'}</h2>
          <form onSubmit={step === 'email' ? handleForgotPassword : handleResetPassword}>
            {step === 'email' ? (
              <>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="d-flex justify-content-center mb-3">
                  <button type="submit" className="btn btn-primary me-2">Enviar Token</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Token de Recuperación</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    required 
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="d-flex justify-content-center mb-3">
                  <button type="submit" className="btn btn-primary me-2">Restablecer Contraseña</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                </div>
              </>
            )}
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

export default ForgotPassword;
