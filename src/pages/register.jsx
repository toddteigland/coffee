import React from "react";
import styles from '../styles/register.module.css'
import { Link } from "react-router-dom";

export default function Register() {

  return (
    <div className={styles.registerContainer}>
      <Link to="/user-register">
      <div className={styles.card}>
        <h3>Register as User</h3>
      </div>
      </Link>
      <Link to="/store-register">
      <div className={styles.card}>
        <h3>Register as Business</h3>
      </div>
      </Link>
    </div>
  );
}
