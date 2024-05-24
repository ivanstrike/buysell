import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { removeItem, addItem } from '../state/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { loadCartSuccess } from '../state/slices/cartSlice';
import { CartItem } from '../state/slices/cartSlice';
import useAxios from '../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token); // Get the token from the Redux store
  const instance = useAxios();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch('https://localhost:7107/api/Cart/GetCart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to load cart', data.message);
      } else {
        dispatch(loadCartSuccess(data));
        setQuantities(data.reduce((acc: { [key: string]: number }, item: CartItem) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {}));
        
      }
    };

    fetchCart();
  }, [dispatch, token, token]);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeItem(productId));
    setQuantities(prevQuantities => {
      const newQuantities = { ...prevQuantities };
      delete newQuantities[productId];
      return newQuantities;
    });
  
    // Send a request to the server to remove the item from the cart
    instance.delete(`/Cart/DeleteItem/${productId}`);
  };
  
  const handleIncreaseQuantity = (productId: string) => {
    dispatch(addItem({ productId, quantity: 1 }));
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  
    // Send a request to the server to update the quantity of the item in the cart
    instance.put('/Cart/UpdateQuantity', {
      productId,
      quantity: quantities[productId] + 1,
    }).then(() => {
      // Update the quantities state after the successful update of the quantity on the server
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [productId]: quantities[productId] + 1,
      }));
    }).catch((error) => {
      console.error(error);
    });
  };
  
  const handleDecreaseQuantity = (productId: string) => {
    if (quantities[productId] > 1) {
      dispatch(addItem({ productId, quantity: -1 }));
      setQuantities(prevQuantities => {
        const newQuantities = { ...prevQuantities };
        newQuantities[productId] = prevQuantities[productId] - 1;
  
        // Send a request to the server to update the quantity of the item in the cart
        instance.put('/Cart/UpdateQuantity', {
          productId,
          quantity: quantities[productId],
        });
  
        return newQuantities;
      });
    } else {
      handleRemoveItem(productId);
    }
  };

  // Calculate the total cost of all items in the cart
  const totalCost = cartItems.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      return acc + (product.price * item.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className="container mt-4">
      <button type="button" className="btn btn-link" onClick={() => navigate('/home')}>
        Вернуться к товарам
      </button>
      <h2>Корзина</h2>
      <ul className="list-group">
        {cartItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? (
            <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="me-3">{product.name}</span>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => handleDecreaseQuantity(item.productId)}
                  >
                    -
                  </button>
                  <span className="text-muted">Кол-во: {quantities[item.productId]}</span>
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => handleIncreaseQuantity(item.productId)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="me-3">${product.price}</span>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Удалить товар
                </button>
              </div>
            </li>
          ) : null;
        })}
      </ul>
      {/* Display the total cost of all items in the cart */}
      <div className="d-flex justify-content-end mt-3">
        <h5 className="text-muted">Итого: ${totalCost.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default CartPage;
