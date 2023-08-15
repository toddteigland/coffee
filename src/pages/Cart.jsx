import styles from "../styles/cart.module.css";
import { cartContext, currentStoreContext } from "../App";
import React, { useContext } from "react";

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
    <div className={styles.cartContainer}>
      {Object.keys(currentOrder).length !== 0 ? 
        <div>
          <h1>Your Cart</h1>
          <h3>{currentStore[0].Name}</h3>
        </div> 
        :
        <div>
          <h2>Please select a store and add procucts to Cart</h2>
        </div>
      }
      <div className={styles.cartList}>
        <ul>
          <div className={styles.itemAndRemove}>
            {Object.entries(currentOrder).map(([id, item]) => (
              <li key={id} className={styles.cartItem}>
                {item.name} - ${item.price}
                <button
                  className={styles.remove}
                  onClick={() => handleRemoveClick(id)}
                >
                  {" "}
                  Remove{" "}
                </button>
              </li>
            ))}
          </div>
        </ul>
      </div>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
