import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { removeItem } from '../state/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (productId: string) => {
    dispatch(removeItem(productId));
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
                <span className="text-muted">Кол-во: {item.quantity}</span>
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
