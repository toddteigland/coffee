import React, { useEffect, useState } from "react";
import { useStore } from "../components/StoreContext";
import MonthlyOrdersChart from "../charts/MonthlyOrdersChart";
import PricePerOrderChart from "../charts/PricePerOrderChart";
import styles from '../styles/storeDashboard.module.css';
import OrderCompletion from "../components/OrderCompletion";


export default function StoreDashboard() {
  const { store, isStoreLoggedIn } = useStore();
  const [storeOrders, setStoreOrders] = useState([]);


  useEffect(() => {
    if (store && store.id) {
      const fetchStoreOrders = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/storeOrders/${store.id}`
          );
          const data = await response.json();
          setStoreOrders(data);
        } catch (error) {
          console.error("Error fetching store orders:", error);
        }
      };

      fetchStoreOrders();
    }
  }, []);

  // Get store name for each order
  const getStoreName = (storeInfo) => {
    try {
      const parsedStoreInfo = JSON.parse(storeInfo);
      return parsedStoreInfo?.Name || "Unknown";
    } catch (error) {
      console.error("Error parsing storeInfo:", error);
      return "Unknown";
    }
  };

  return (
    <div>
      <h1>
        {isStoreLoggedIn ? store.store_name : "Please Login to view Dashboard"}
      </h1>
      <h2>Dashboard</h2>

      <div>      
      <h2>Orders</h2>

      <OrderCompletion storeId={store?.id} isStoreLoggedIn={isStoreLoggedIn} />

    </div>

      <div className={styles.chartsContainer}>
        <h2>Charts</h2>
        <MonthlyOrdersChart />
        <PricePerOrderChart />
      </div>

      <h2>Orders</h2>
      {storeOrders.map((order, index) => (
        <div key={index}>
          <h4>Order ID: {order.id}</h4>
          <strong>
            <p>Store: {getStoreName(order.storeinfo)}</p>
          </strong>
          <p>Order Created At: {new Date(order.created_at).toLocaleString()}</p>
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>
                {/* List out each item's details */}
                Product: {item.coffee_type}, Size: {item.size}, Price:{" "}
                {item.price.toFixed(2)}, Extras: {JSON.stringify(item.extras)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
