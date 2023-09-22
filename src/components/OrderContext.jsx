import React, { createContext, useState, useContext } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [newOrders, setNewOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [pickedUpOrders, setPickedUpOrders] = useState([]);

  return (
    <OrderContext.Provider
      value={{
        newOrders,
        setNewOrders,
        completedOrders,
        setCompletedOrders,
        pickedUpOrders,
        setPickedUpOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrderContext);
};
