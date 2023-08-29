import React from "react";
import styles from "../styles/loginButton.module.css"
import { Link } from "react-router-dom";

const LoginButton = () => {

  return <Link to="/login"><button className={styles.loginButton}>Log In</button></Link>;
};

export default LoginButton;