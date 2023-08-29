import React, { useState } from "react";
import styles from "../styles/form.module.css";
import loginStyles from "../styles/login.module.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, user } = useAuth();
  const [loginErrorPopup, setLoginErrorPopup] = useState(false);
  const [formData, setFormData] = useState ({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {

      // Fetch user data from server
      const userInfoResponse = await fetch(`http://localhost:8080/getUserInfo?email=${formData.email}`);
      const userInfo = await userInfoResponse.json();


        setIsLoggedIn(true);
        setUser(userInfo);
        // Successful login, you can redirect or handle accordingly
        navigate("/products", { replace: true });
      } else {
        // Failed login, handle accordingly
        setLoginErrorPopup(true);
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit} >
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // autoComplete="true"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="false"
          />
        </label>
        <input type="submit" name="submit" />
      </form>

      {loginErrorPopup && (
        <div className={loginStyles["login-popup"]}>
          <p>
            Please enter valid credentials to <Link to="/login" onClick={() => setLoginErrorPopup(false)}>login</Link>
          </p>
        </div>
      )}
    </div>
  );
}
