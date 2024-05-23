import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../state/store';

const AddProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7107/api/Product', {
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
    <div className="container">
      <button type="button" className="btn btn-link mt-3" onClick={() => navigate('/home')}>
          Вернуться к товарам
        </button>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="text"
            className="form-control"
            id="price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
