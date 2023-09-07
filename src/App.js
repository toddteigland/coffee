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
import StoreRegister from "./pages/StoreRegister";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import StoreDashboard from "./pages/StoreDashboard";

import { AuthProvider } from "./components/AuthContext";
import { StoreProvider } from "./components/StoreContext";
import { SocketProvider } from "./components/SocketContext";

export const currentStoreContext = createContext();
export const cartContext = createContext();

export default function App() {
  const [currentStore, setCurrentStore] = useState({});
  const [currentOrder, setCurrentOrder] = useState({});

  return (
    <div className={styles.appContainer}>
      <AuthProvider>
        <StoreProvider>
          <currentStoreContext.Provider value={[currentStore, setCurrentStore]}>
            <cartContext.Provider value={[currentOrder, setCurrentOrder]}>
              <SocketProvider>
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
                    <Route path="/store-register" element={<StoreRegister />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/store-dashboard"
                      element={<StoreDashboard />}
                    />
                  </Routes>
                </ScrollToTop>

                <Footer />
              </SocketProvider>
            </cartContext.Provider>
          </currentStoreContext.Provider>
        </StoreProvider>
      </AuthProvider>
    </div>
  );
}
