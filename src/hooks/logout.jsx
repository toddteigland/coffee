import React from 'react';
import { useAuth } from "../components/AuthContext";
import { useStore } from "../components/StoreContext";
import { useNavigate } from "react-router";

export default function useLogout() {
  const { logout } = useAuth();
  const { logoutStore, store } = useStore();
  const navigate = useNavigate();

  return () => {

    if (!store) {
      logout();
    } else {
      logoutStore();
    }
    navigate("/home", { replace: true });
  };
}
