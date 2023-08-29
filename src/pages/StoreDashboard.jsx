// StoreDashboard.js
import React, { useEffect, useState } from "react";
import { useStore } from "../components/StoreContext";

export default function StoreDashboard() {
  const [ store, isStoreLoggedIn ] = useStore();
  const [storeOrders, setStoreOrders] = useState([]);

  useEffect(() => {
    const fetchStoreOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/storeOrders/${store.id}");
        const data = await response.json();
        console.log('DASHBOARD DATA', data);
        setStoreOrders(data);
      } catch (error) {
        console.error("Error fetching store orders:", error);
      }
    };

    fetchStoreOrders();
  }, []);

  return (
    <div>
      <h1>Store Dashboard</h1>
      <h2>{isStoreLoggedIn ? store.name : "Please Login to view Dashboard"}</h2>
      {/* Display orders here */}
    </div>
  );
}
