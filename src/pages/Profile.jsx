import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import styles from "../styles/profile.module.css";

export default function Profile() {
  const { isLoggedIn, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [ischangePassword, setIsChangePassword] = useState(false);

  // Initialize state to hold the orders
  const [userOrders, setUserOrders] = useState([]);
  const [page, setPage] = useState(1);

  // Fetch orders using useEffect
  useEffect(() => {
    // Check if user exists before fetching orders
    if (user && user.id) {
      const fetchUserOrders = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/userOrders/${user.id}?page=${page}&limit=10`
          );
          const data = await response.json();
          setUserOrders(data);
        } catch (error) {
          console.error("There was an error fetching user orders:", error);
        }
      };

      fetchUserOrders();
    }
  }, [user, page]);

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

  const loadMoreOrders = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const loadPreviousOrders = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePasswordChangeSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords must match");
    } else {
      try {
        const response = await fetch(`http://localhost:8080/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            currentPassword,
            newPassword,
          }),
        });
        if (response.ok) {
          setCurrentPassword("");
          setNewPassword("");
          setIsChangePassword(false);
          alert("Password changed successfully");
        } else {
          const errorData = await response.json();
          console.log("Error chaning user password", errorData);
        }
      } catch (error) {
        console.log("Error changing user password", error);
      }
    }
  };

  const changePassword = () => {
    setIsChangePassword(!ischangePassword);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        {/* Check if user exists before displaying email */}
        <h1>Dashboard</h1>
        <h2>{user ? user.email : "Please Login"}</h2>
      </div>

      <div className={styles.ordersContainer}>
        <h3> Profile</h3>
        <p>
          Name: {user.first_name} {user.last_name}
        </p>
        <p>Email: {user.email} </p>
        <button onClick={changePassword}>Change Password</button>
        {ischangePassword && (
          <div className={styles.passwordChange}>
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <label>New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChangeSubmit}>Submit Change</button>
          </div>
        )}
      </div>
      <div className={styles.ordersContainer}>
        {isLoggedIn && (
          <div>
            <h3>My Orders:</h3>
            {/* Map through the userOrders to display individual orders and their items */}
            {userOrders.map((order, index) => (
              <div key={index} className={styles.order}>
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
                      Product: {item.coffee_type}, Size: {item.size}, Price:{" "}
                      {item.price.toFixed(2)}
                      {/* , Extras:{" "}
                      {JSON.stringify(item.extras)} */}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.pagination}>
        <div className={styles.pageButtons}>
          <button onClick={loadPreviousOrders} hidden={page <= 1}>
            Previous
          </button>
          <button onClick={loadMoreOrders} hidden={userOrders.length === 0}>
            Next
          </button>
        </div>
        <div>
          <p>Page {page}</p>
        </div>
      </div>
    </div>
  );
}
