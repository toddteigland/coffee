import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useStore } from "./StoreContext";
import { useNavigate } from "react-router";

export default function LogoutButton() {
  const { logout } = useAuth();
  const { logoutStore, store } = useStore();
  const navigate = useNavigate();

const handleLogout = () => {
  if (!store) {
    logout();
    navigate("/products", { replace: true })
  } else {
    logoutStore();
    navigate("/products", { replace: true})
  }
}

  return (
    <div>
      {!store ? (
        <button onClick={handleLogout}>
          Log Out
        </button>
      ) : (
        <button onClick={handleLogout}>
          Log Out
        </button>
      )}
    </div>
  );
};