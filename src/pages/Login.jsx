import React, { useState, useEffect } from "react";
import loginStyles from "../styles/login.module.css";
import footerStyles from "../styles/footer.module.css";
import { useAuth } from "../components/AuthContext";
import { useStore } from "../components/StoreContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, user } = useAuth();
  const { setIsStoreLoggedIn, setStore, store } = useStore();

  const [loginErrorPopup, setLoginErrorPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [isStore, setIsStore] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isStore) {
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
          const userInfoResponse = await fetch(
            `http://localhost:8080/getUserInfo?email=${formData.email}`
          );
          const userInfo = await userInfoResponse.json();

          setIsLoggedIn(true);
          setUser(userInfo);
          // Successful login, you can redirect or handle accordingly
          navigate("/products", { replace: true });
        } else {
          // Failed login, handle accordingly
          setLoginErrorPopup(true);
          console.log("User Login failed");
        }
      } catch (error) {
        console.error("Error logging User in:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:8080/store-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const storeInfoResponse = await fetch(
            `http://localhost:8080/getStoreInfo?email=${formData.email}`
          );
          const storeInfo = await storeInfoResponse.json();
          setStore(storeInfo);
          setIsStoreLoggedIn(true);
          navigate("/store-dashboard", { replace: true });
        } else {
          setLoginErrorPopup(true);
          console.log("Store Login Failed");
        }
      } catch (error) {
        console.error("Error Logging Store in:", error);
      }
    }
  };

  //LOGIN USER/STORE TOGGLE
  useEffect(() => {
    const toggleSwitch = document.getElementById("loginToggle");

    function switchLoginType(e) {
      const isStoreMode = e.target.checked;
      setIsStore(isStoreMode);
      document.getElementById("loginType").innerHTML = isStoreMode
        ? "Store Login"
        : "User Login";
    }

    if (toggleSwitch !== null) {
      toggleSwitch.addEventListener("change", switchLoginType);
    }

    return () => {
      if (toggleSwitch !== null) {
        toggleSwitch.removeEventListener("change", switchLoginType);
      }
    };
  }, []);

  return (
    <div className={loginStyles.loginContainer}>
      <div className={loginStyles.formContainer}>
        <div className={footerStyles.themeswitchwrapper}>
          <label className={footerStyles.themeswitch} htmlFor="loginToggle">
            <input type="checkbox" id="loginToggle" />
            <div className={footerStyles.slider}></div>
          </label>
          <em id="loginType" className={footerStyles.em}>
            User Login
          </em>
        </div>
        <form className={loginStyles.form} onSubmit={handleSubmit}>
          <div className={loginStyles.email}>
            <label>
              Email:
              <input
                type="text"
                name="email"
                placeholder="fake@email.com"
                value={formData.email}
                onChange={handleChange}
                // autoComplete="true"
              />
            </label>
          </div>
          <div className={loginStyles.password}>
            <label>
              Password:
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="false"
              />
            </label>
          </div>
          <div className={loginStyles.submit}>
            <input type="submit" name="submit" />
          </div>
        </form>
      </div>

      {loginErrorPopup && (
        <div className={loginStyles["login-popup"]}>
          <p>
            Please enter valid credentials to{" "}
            <Link to="/login" onClick={() => setLoginErrorPopup(false)}>
              login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
