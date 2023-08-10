import "../styles/product.css";
import products from "../products.json";
import { cartContext, currentStoreContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Customize from "../components/Customize";

export default function Product() {
  const currentStore = useContext(currentStoreContext);
  const [currentOrder, setCurrentOrder] = useContext(cartContext);

  const handleAddToCartClick = (name, price) => {
    const uniqueId = uuidv4();
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      [uniqueId]: { name, price },
    }));
  };

  return (
    <div className="productcontainer">
      <h1>{currentStore[0].Name}</h1>
      <h2>{currentStore[0].Address}</h2>

      <div className="grid">
        {products.map((product) => {
          return (
            <div key={product.id} className="card">
              <img src={product.image} alt={`Preview of ${product.title}`} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <div className="buttons">
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
    </div>
  );
}
