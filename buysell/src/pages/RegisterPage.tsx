import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../my.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false); // Add a state variable to track whether an error has occurred
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(false); // Reset the error state before attempting to register

    try {
      await axios.post('https://localhost:7107/api/Auth/Register', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Failed to register', error);
      setError(true); // Set the error state if the registration fails
    }
  };

  return (
    <div className="light-blue-background">
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="p-4 bg-white rounded shadow-sm" style={{ width: '320px' }}>
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Имя</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                placeholder="Введите имя"
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Почта</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                placeholder="Введите почту"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                placeholder="Введите пароль"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
          </form>
          {error && <p className="text-danger text-center mt-3">Некорректные данные</p>} {/* Display an error message if the error state is true */}
          <button type="button" className="btn btn-link w-100 mt-3" onClick={() => navigate('/login')}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
