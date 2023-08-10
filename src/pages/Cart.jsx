import "../styles/cart.css";
import { cartContext, currentStoreContext } from "../App";
import { useContext } from "react";

export default function Cart() {
  const currentStore = useContext(currentStoreContext);
  const [currentOrder, setCurrentOrder] = useContext(cartContext);
  const totalPrice = Object.values(currentOrder).reduce(
    (acc, item) => acc + parseFloat(item.price),
    0.0
  );

  const handleRemoveClick = (itemId) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      delete updatedOrder[itemId];
      return updatedOrder;
    });
  };

  return (
    <div className="cartContainer">
      <h1>Your Cart</h1>
      <h3>{currentStore[0].Name}</h3>
      <div className="cartList">
        <ul>
          <div className="itemAndRemove">
            {Object.entries(currentOrder).map(([id, item]) => (
              <li key={id} className="cartItem">
                {item.name} - ${item.price}
                <button
                  className="remove"
                  onClick={() => handleRemoveClick(id)} > Remove </button>
              </li>
            ))}
          </div>
        </ul>
      </div>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
