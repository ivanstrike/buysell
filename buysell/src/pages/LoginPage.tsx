import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setToken } from '../state/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7107/api/Auth/Login', { email, password });
      dispatch(setToken(response.data.token));
      navigate('/home');
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <button type="button" className="btn btn-link mt-3" onClick={() => navigate('/register')}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
