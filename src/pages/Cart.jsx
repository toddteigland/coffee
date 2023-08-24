import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/cart.module.css";
import { cartContext, currentStoreContext } from "../App";

export default function Cart() {
  const [currentStore] = useContext(currentStoreContext);
  const [currentOrder, setCurrentOrder] = useContext(cartContext);
  const totalPrice = Object.values(currentOrder).reduce(
    (acc, item) => acc + parseFloat(item.price),
    0.0
  );

  useEffect(() => {
    console.log("Current Store", currentStore[0]);
    console.log("Current Order", currentOrder[0]);
  }, [currentStore, currentOrder]);

  const handleRemoveClick = (itemId) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      delete updatedOrder[itemId];
      return updatedOrder;
      console.log("UPDATED ORDER: ", updatedOrder);
    });
  };

  let cartHeader;
  if (
    Object.keys(currentOrder).length === 0 &&
    Object.keys(currentStore).length === 0
  ) {
    cartHeader = (
      <div>
        <h3>Please select a <Link to="/storelocator" className={styles.link}>Store</Link></h3>
      </div>
    );
  } else if (
    Object.keys(currentOrder).length === 0 &&
    Object.keys(currentStore).length !== 0
  ) {
    cartHeader = (
      <div>
        <h3>{currentStore.Name}</h3>
        <h3> Please add <Link to="/products" className={styles.link}>products</Link> to your cart</h3>
      </div>
    );
  } else {
    <h3>{currentStore.Name} Else</h3>;
  }

  return (
    <div className={styles.cartContainer}>
      <h1>Your Cart</h1>
      {cartHeader}

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
