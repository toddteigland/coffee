import styles from "./styles/App.module.css";
import { Routes, Route, Navigate, Router } from "react-router";
import { useState, createContext } from "react";

import Cart from "./pages/Cart";
import Header from "./partials/header";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Product from "./pages/Product.jsx";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./partials/footer";
import Register from "./pages/register";
import UserRegister from "./pages/UserRegister";
import BusinessRegister from "./pages/BusinessRegister";
import Login from "./pages/Login";
import { AuthProvider } from "./components/AuthContext";
import Profile from "./pages/Profile";

export const currentStoreContext = createContext();
export const cartContext = createContext();

export default function App() {
  const [currentStore, setCurrentStore] = useState({});
  const [currentOrder, setCurrentOrder] = useState({});

  return (
    <div className={styles.appContainer}>
      <AuthProvider>
        <currentStoreContext.Provider value={[currentStore, setCurrentStore]}>
          <cartContext.Provider value={[currentOrder, setCurrentOrder]}>
            <Header />

            <ScrollToTop>
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<Product />} />
                <Route path="/storelocator" element={<Map />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-register" element={<UserRegister />} />
                <Route path="/business-register" element={<BusinessRegister />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </ScrollToTop>

            <Footer />
          </cartContext.Provider>
        </currentStoreContext.Provider>
      </AuthProvider>
    </div>
  );
}
