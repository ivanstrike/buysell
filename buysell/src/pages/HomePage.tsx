import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../state/slices/productSlice';
import { addItem } from '../state/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../state/store';
import { clearToken } from '../state/slices/userSlice';
import useAxios from '../utils/axios';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();
  const instance = useAxios();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await instance.get('/Product');
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, [dispatch, token, instance]);

  const handleAddToCart = async (productId: string) => {
    try {
      dispatch(addItem({ productId, quantity: 1 }));

      const response = await axios.post(
        `https://localhost:7107/api/Cart/AddToCart?productId=${productId}`, 
        {},  
        {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        }
    );
      if (response.status === 200) {
        console.log('Cart updated in database');
      }
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button type="button" className="btn btn-link" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
        <h2 style={{ fontWeight: 'bold' }}>Товары</h2>
        <div className="d-flex">
        <button type="button" className="btn me-2" style={{ backgroundColor: '#043D92', color: 'white' }} onClick={() => navigate('/addproduct')}>
          Добавить свой товар
        </button>

          <Link to="/cart" className="btn btn-secondary">
            Корзина
          </Link>
        </div>
      </div>
      <div className="row">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">${product.price}</p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col">
            <div className="alert alert-light">
              <p>No products available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
