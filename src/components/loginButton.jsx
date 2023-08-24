import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/loginButton.module.css"

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();

  return <button className={styles.loginButton} onClick={() => loginWithPopup()}>Log In</button>;
};

export default LoginButton;