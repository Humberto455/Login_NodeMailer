import React, { useState } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToastMessage('Las contraseñas no coinciden');
      setShowToast(true);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { token, newPassword });
      setToastMessage(response.data.message);
      setShowToast(true);
      navigate('/login');
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 col-lg-4">
          <h2 className="text-center mb-4">Restablecer Contraseña</h2>
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label">Nueva Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                style={{ width: '100%' }} // Hace que el input ocupe el 100% del ancho del contenedor
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                style={{ width: '100%' }} // Hace que el input ocupe el 100% del ancho del contenedor
              />
            </div>
            <div className="d-flex justify-content-center mb-3">
              <button type="submit" className="btn btn-primary mx-2">Confirmar</button>
              <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate('/login')}>Cancelar</button>
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

export default ResetPassword;
