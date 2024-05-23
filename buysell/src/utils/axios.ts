import axios from 'axios';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';

const useAxios = () => {
  const token = useSelector((state: RootState) => state.user.token);

  const instance = axios.create({
    baseURL: 'https://localhost:7107/api', // Замените на ваш базовый URL API
  });

  instance.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export default useAxios;
