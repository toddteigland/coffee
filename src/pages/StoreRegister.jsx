import React, { useState } from "react";
import styles from "../styles/form.module.css";

export default function StoreRegister() {
  const [registrationError, setRegistrationError] = useState(null); // Add this
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    googleId:"",
    email: "",
    password: "",
  });

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
      const response = await fetch("http://localhost:8080/store-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName: formData.storeName,
          storeAddress: formData.storeAddress,
          googleId: formData.googleId,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Registration successful, you can redirect or show a success message
        setFormData({});
      } else {
        const errorData = await response.json();
        if (errorData.error === "Email already in use") {
          setRegistrationError(
            "This email is already in use. Please sign in or use a different email."
          );
      } else {
        //Handle other registration errors
      }
    }
    } catch (error) {
      console.error("Error registering store:", error);
    }
  };

  return (
    <div className={styles.userRegisterContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Store Name:
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
          />
        </label>
        <label>
          Store Address:
          <input
            type="text"
            name="storeAddress"
            value={formData.storeAddress}
            onChange={handleChange}
          />
        </label>
        <label>
          Store Id:
          <input
            type="text"
            name="googleId"
            value={formData.googleId}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.hashedPassword}
            onChange={handleChange}
          />
        </label>
        <input type="submit" name="submit" />
      </form>

      {registrationError && (
        <div className={styles.errorPopup}>{registrationError}</div>
      )}
    </div>
  );
}
