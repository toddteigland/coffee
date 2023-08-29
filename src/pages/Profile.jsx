import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const { isLoggedIn, user } = useAuth();

  // Initialize state to hold the orders
  const [userOrders, setUserOrders] = useState([]);

  // Fetch orders using useEffect
  useEffect(() => {
    // Check if user exists before fetching orders
    if (user && user.id) {
      // Async function to fetch user orders
      const fetchUserOrders = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/userOrders/${user.id}`
          );
          const data = await response.json();
          setUserOrders(data);
        } catch (error) {
          console.error("There was an error fetching user orders:", error);
        }
      };

      // Invoke the function
      fetchUserOrders();
    }
  }, [user]); // Dependency array now includes 'user'

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
      <div>
        {/* Check if user exists before displaying email */}
        <h2>{user ? user.email : "Please Login"}</h2>
      </div>
      <div>
        {isLoggedIn && (
          <div>
            <h3>My Orders:</h3>
            {/* Map through the userOrders to display individual orders and their items */}
            {userOrders.map((order, index) => (
              <div key={index}>
                <h4>Order ID: {order.id}</h4>
                <strong>
                  <p>Store: {getStoreName(order.storeinfo)}</p>
                </strong>
                <p>
                  Order Created At:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {/* List out each item's details */}
                      Item ID: {item.id}, Product: {item.coffee_type}, Size:{" "}
                      {item.size}, Price: {item.price.toFixed(2)}, Extras:{" "}
                      {JSON.stringify(item.extras)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
