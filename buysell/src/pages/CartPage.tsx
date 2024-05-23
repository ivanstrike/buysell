import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { removeItem } from '../state/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRemoveItem = (productId: string) => {
    dispatch(removeItem(productId));
  };

  return (
    <div className="container">
      <h2>Cart</h2>
      <ul className="list-group">
        {cartItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? (
            <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
              {product.name} - {item.quantity} x ${product.price}
              <button
                className="btn btn-danger"
                onClick={() => handleRemoveItem(item.productId)}
              >
                Remove
              </button>
            </li>
          ) : null;
        })}
      </ul>
      <button type="button" className="btn btn-link mt-3" onClick={() => navigate('/home')}>
        Вернуться к товарам
      </button>
    </div>
  );
};

export default CartPage;