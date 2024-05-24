import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../state/store';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AddProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post('https://localhost:7107/api/Product', {
        name,
        description,
        price,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/home');
    } catch (error) {
      console.error('Failed to add product', error);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="card-title text-center mb-4">Создание товара</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Название</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Введите название"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Описание</label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Введите описание товара"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Цена($)</label>
            <input
              type="text"
              className="form-control"
              id="price"
              placeholder="Введите цену"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Создать товар</button>
        </form>
        <button type="button" className="btn btn-link mt-3" onClick={() => navigate('/home')}>
          Назад
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;
