import React from "react";
import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: "http://localhost:3000/products" } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;