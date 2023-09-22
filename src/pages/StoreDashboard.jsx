import React, { useEffect, useState } from "react";
import { useStore } from "../components/StoreContext";
import MonthlyOrdersChart from "../charts/MonthlyOrdersChart";
import PricePerOrderChart from "../charts/PricePerOrderChart";
import styles from '../styles/storeDashboard.module.css';
import OrderCompletion from "../components/OrderCompletion";

export default function StoreDashboard() {
  const { store, isStoreLoggedIn } = useStore();
  const [storeOrders, setStoreOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchStoreOrders = async () => {
    try {
      let url = `http://localhost:8080/storeOrders/${store.id}`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setStoreOrders(data);
      } else {
        console.error('Data received is not an Array: ', data);
        setStoreOrders([]);
      }
    } catch (error) {
      console.error("Error fetching store orders:", error);
      setStoreOrders([]);
    }
  };

  useEffect(() => {
    if (store && store.id) {
      // fetchStoreOrders();
    }
  }, [store, startDate, endDate]);

  const handleFilterByDate = () => {
    // This will trigger fetchStoreOrders via the useEffect by changing the startDate and endDate
    if (startDate && endDate) {
      fetchStoreOrders();
    }
  };

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
      <div className={styles.dashboardHeader}>

      <h1>
        {isStoreLoggedIn ? store.store_name : "Please Login to view Dashboard"}
      </h1>
      <h2>Dashboard</h2>
      </div>

      <div className={styles.dashboardContainers}>      
      <h3>Current Orders</h3>

      <OrderCompletion storeId={store?.id} isStoreLoggedIn={isStoreLoggedIn} />

      </div>

      <div className={styles.dashboardContainers}>
        <div className={styles.chartsContainer}>
          <h3>Charts</h3>
            <MonthlyOrdersChart />
            <PricePerOrderChart />
          </div>
      </div>

      <div className={styles.dashboardContainers}>
      <h3>View Orders by Date</h3>
        <div className={styles.filter}>

        <label>
          Start Date:
          <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value)}  style={{ 'margin-left': '5px'}} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate || ''} onChange={(e) => setEndDate(e.target.value)} style={{ 'margin-left': '5px'}}/>
        </label>
        <button onClick={handleFilterByDate}>Filter</button>
        </div>
      </div>
      
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
                 {item.price.toFixed(2)}
                 {/* , Extras: {JSON.stringify(item.extras)}  */}
               </li> 
             ))} 
           </ul> 
         </div> 
       ))} 
     </div>
  );
}
