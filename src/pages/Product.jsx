import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/product.module.css";
import products from "../products.json";
import { cartContext, currentStoreContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import Customize from "../components/Customize";

export default function Product() {
  const [currentStore] = useContext(currentStoreContext);
  const [currentOrder, setCurrentOrder] = useContext(cartContext);
  const [selectStorePopup, setSelectStorePopup] = useState(false);
  const [itemAddedPopup, setItemAddedPopup] = useState(false);
  const [itemAdded, setItemAdded] = useState("");

  const handleAddToCartClick = (name, price) => {
    if (Object.keys(currentStore).length === 0) {
      setSelectStorePopup(true);
      return;
    }
    const uniqueId = uuidv4();
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      [uniqueId]: { name, price },
    }));
    setItemAdded(name);
    setItemAddedPopup(true);
    setTimeout(() => {
      setItemAddedPopup(false);
    }, 2000);
  };

  return (
    <div className={styles.productcontainer}>
      <h1>{currentStore?.Name}</h1>
      <h2>{currentStore?.Address}</h2>

      <div className={styles.grid}>
        {products.map((product) => {
          return (
            <div key={product.id} className={styles.card}>
              <img src={product.image} alt={`Preview of ${product.title}`} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <div className={styles.buttons}>
                <button
                  onClick={() =>
                    handleAddToCartClick(product.title, product.price)
                  }
                >
                  Add to Cart
                </button>
                <Customize />
              </div>
            </div>
          );
        })}
      </div>

      {itemAddedPopup && (
        <div className={styles["itemAdded-popup"]}>
          <p>{itemAdded} added!</p>
        </div>
      )}

      {selectStorePopup && (
        <div className={styles["selectStore-popup"]}>
          <p>Please select a store to proceed:</p>
          <Link to="/storelocator">Go to Store Locator</Link>
        </div>
      )}
    </div>
  );
}
