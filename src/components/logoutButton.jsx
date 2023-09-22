import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useStore } from "./StoreContext";
import { useNavigate } from "react-router";
import useLogout from "../hooks/logout.jsx";


export default function LogoutButton() {

  const handleLogout = useLogout();

  return (
    <div>
        <button onClick={handleLogout}>
          Log Out
        </button>
    </div>
  );
};