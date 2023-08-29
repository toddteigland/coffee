import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/cart.module.css";
import { cartContext, currentStoreContext } from "../App";
import { useAuth } from "../components/AuthContext";

export default function Cart() {
  const {user} = useAuth();
  const [currentStore] = useContext(currentStoreContext);
  const [currentOrder, setCurrentOrder] = useContext(cartContext);
  const totalPrice = Object.values(currentOrder).reduce(
    (acc, item) => acc + parseFloat(item.price),
    0.0
  );

  const handleRemoveClick = (itemId) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      delete updatedOrder[itemId];
      console.log("UPDATED ORDER: ", updatedOrder);
      return updatedOrder;
    });
  };

  const handleSubmitOrder = async (event) => {
    event.preventDefault();
    const items = Object.values(currentOrder).map((item) => {
      return {
        coffee_type: item.name,  // assuming item.name contains coffee_type
        size: item.size,  // replace with actual size if exists
        price: item.price,
        extras: item.extras // replace with actual extras if exists
      };
    });
    const orderPayload = {
      userId: user? user.id: null,
      items: items,
      storeInfo: currentStore
    };

    try {
      const response = await fetch("http://localhost:8080/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Order submitted successfully. Order ID:", responseData.orderId);
        //Empty Cart after submission
        setCurrentOrder({});
      } else {
        console.error("Failed to submit order. Server responded with: ", response.status);
      }
    } catch (error) {
      console.error("An error occurred while submitting order: ", error);
    }
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
    cartHeader = (
      <div>
        <h3>{currentStore.Name}</h3>;
      </div>
    )
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
      <p>Total: <strong>${totalPrice.toFixed(2)}</strong></p>
      <button onClick={handleSubmitOrder}>Submit Order</button>
    </div>
  );
}
