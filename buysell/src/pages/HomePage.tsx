import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import axios from 'axios';
import { setProducts } from '../state/slices/productSlice';
import { addItem } from '../state/slices/cartSlice';
import { Link } from 'react-router-dom';
import { RootState } from '../state/store';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../state/slices/userSlice';
import useAxios from '../utils/axios';
import axios from 'axios';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
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
  }, [dispatch, token]);

  const handleAddToCart = async (productId: string) => {
    try {
      // Находим товар в корзине по его идентификатору
      dispatch(addItem({ productId, quantity: 1 }));
      //console.log(productId);
      //console.log(token);
      // Вызываем метод AddToCart() контроллера, чтобы обновить корзину в базе данных
      const response = await axios.post(
        `https://localhost:7107/api/Cart/AddToCart?productId=${productId}`, 
        {},  // пустое тело запроса
        {
            headers: {
                Authorization: `Bearer ${token}` // Указываем токен в заголовке
            }
        }
    );
      if (response.status === 200) {
        console.log('Cart updated in database');
      }
    } catch (error : any) {
      console.error(error.response.data);
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col">
        <button type="button" className="btn btn-link mt-3" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
          <h2>Products</h2>
        </div>
        <div className="col-auto">
        <button type="button" className="btn btn-link mt-3" onClick={() => navigate('/addproduct')}>
          Добавить товар
        </button>
        </div>
        <div className="col-auto">
          <Link to="/cart" className="btn btn-secondary">
            Cart
          </Link>
        </div>
      </div>
      {products.length > 0 ? (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">${product.price}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert bg-light">
          <p>No products available.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
