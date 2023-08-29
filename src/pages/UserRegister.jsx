import React, { useState } from "react";
import styles from "../styles/form.module.css";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [registrationError, setRegistrationError] = useState(null); // Add this

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
      const response = await fetch("http://localhost:8080/user-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Registration successful, you can redirect or show a success message
      } else {
        const errorData = await response.json();
        if (errorData.error === "Email already in use") {
          setRegistrationError(
            "This email is already in use. Please sign in or use a different email."
          );
        } else {
          // Handle other registration errors
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/get-users");

      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Update the state with fetched users
      } else {
        console.error("Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className={styles.userRegisterContainer}>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="true">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
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
        <input type="submit" name="Submit" />
      </form>

      {registrationError && (
        <div className={styles.errorPopup}>{registrationError}</div>
      )}

      <h1>List of Users</h1>
      <ol>
        {users.map((user) => (
          <li key={user.id}>
            User ID: {user.id} - {user.first_name} {user.last_name} - {user.email}
          </li>
        ))}
      </ol>
      <button onClick={fetchUsers}>Fetch Users</button>
    </div>
  );
}
