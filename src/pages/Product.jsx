import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import styles from "../styles/product.module.css";
import { cartContext, currentStoreContext } from "../App";
import products from "../products.json";
import Customize from "../components/Customize";
import { useAuth } from "../components/AuthContext";

export default function Product() {
  const [currentStore] = useContext(currentStoreContext);
  const [currentOrder, setCurrentOrder] = useContext(cartContext);
  const [selectStorePopup, setSelectStorePopup] = useState(false);
  const [itemAddedPopup, setItemAddedPopup] = useState(false);
  const [isLoggedInPopup, setIsLoggedInPopup] = useState(false);
  const [itemAdded, setItemAdded] = useState("");
  const { isLoggedIn } = useAuth();
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCartClick = (name, price) => {
    if (!isLoggedIn) {
      setIsLoggedInPopup(true);
      return;
    }
    if (Object.keys(currentStore).length === 0) {
      setSelectStorePopup(true);
      return;
    }
    const uniqueId = uuidv4();
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      [uniqueId]: { name, price: price[selectedSize], size: selectedSize },
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
      <p>{currentStore?.Address}</p>
      <h2>Products</h2>
      <div className={styles.grid}>
        {products.map((product) => {
          return (
            <div key={product.id} className={styles.card}>
              <img src={product.image} alt={`Preview of ${product.title}`} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div>
                {/* <p>Size:</p> */}
                <label>S</label>
                <input
                  type="radio"
                  name="radio"
                  value="S"
                  onChange={(e) => setSelectedSize(e.target.value)}
                ></input>
                <label>M</label>
                <input
                  type="radio"
                  name="radio"
                  value="M"
                  onChange={(e) => setSelectedSize(e.target.value)}
                ></input>
                <label>L</label>
                <input
                  type="radio"
                  name="radio"
                  value="L"
                  onChange={(e) => setSelectedSize(e.target.value)}
                ></input>
                <label>XL</label>
                <input
                  type="radio"
                  name="radio"
                  value="XL"
                  onChange={(e) => setSelectedSize(e.target.value)}
                ></input>
              </div>
              <p>
                ${selectedSize ? product.price[selectedSize] : `${Math.min(...Object.values(product.price))} - ${Math.max(...Object.values(product.price) )}`}
              </p>
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

      {isLoggedInPopup && (
        <div className={styles["selectStore-popup"]}>
          <p>
            Please <Link to="/login">Login</Link> to add Products to your Cart
          </p>
        </div>
      )}
    </div>
  );
}
