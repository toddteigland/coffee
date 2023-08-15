import styles from "./styles/App.module.css";
import { Routes, Route, Navigate } from "react-router";
import { useState, createContext } from "react";

import Cart from "./pages/Cart";
import Header from "./components/header";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Product from "./pages/Product.jsx";

export const currentStoreContext = createContext();
export const cartContext = createContext();

export default function App() {
  const [currentStore, setCurrentStore] = useState({});
  const [currentOrder, setCurrentOrder] = useState({});

  return (
    <div className={styles.appContainer}>
      <currentStoreContext.Provider value={[currentStore, setCurrentStore]}>
        <cartContext.Provider value={[currentOrder, setCurrentOrder]}>
          <Header />

          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Product />} />
            <Route path="/storelocator" element={<Map />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </cartContext.Provider>
      </currentStoreContext.Provider>
    </div>
  );
}
