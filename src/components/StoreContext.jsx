import React, { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [isStoreLoggedIn, setIsStoreLoggedIn] = useState(false);
  const [store, setStore] = useState(null);

  const loginStore = (storeData) => {
    setStore(storeData);
    setIsStoreLoggedIn(true);
  };

  const logoutStore = () => {
    setStore(null);
    setIsStoreLoggedIn(false);
  };

  return (
    <StoreContext.Provider value={{ isStoreLoggedIn, setIsStoreLoggedIn, store, setStore, loginStore, logoutStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
