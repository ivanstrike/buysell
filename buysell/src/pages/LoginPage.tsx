import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setToken } from '../state/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../my.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false); // Add a state variable to track whether an error has occurred
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(false); // Reset the error state before attempting to log in

    try {
      const response = await axios.post('https://localhost:7107/api/Auth/Login', { email, password });
      dispatch(setToken(response.data.token));
      navigate('/home');
    } catch (error) {
      console.error('Failed to login', error);
      setError(true); // Set the error state if the login fails
    }
  };

  return (
    <div className="light-blue-background">
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="p-4 bg-white rounded shadow-sm" style={{ width: '320px' }}>
          <h2 className="text-center mb-4">Вход</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Почта</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Введите логин"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Введите пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Войти</button>
          </form>
          {error && <p className="text-danger text-center mt-3">Некорректные данные</p>} {/* Display an error message if the error state is true */}
          <button type="button" className="btn btn-link w-100 mt-3" onClick={() => navigate('/register')}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
