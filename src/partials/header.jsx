import { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useStore } from "../components/StoreContext"

import styles from "../styles/header.module.css";
import Dropdown from "../components/Dropdown";
import { cartContext } from "../App";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";
import RegisterButton from "../components/registerButton";
import useLogout from "../hooks/logout.jsx";
 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [currentOrder] = useContext(cartContext);
  const { isLoggedIn, user } = useAuth();
  const { isStoreLoggedIn, store } = useStore();
  const handleLogout = useLogout();


  const totalPrice = Object.values(currentOrder).reduce(
    (acc, item) => acc + parseFloat(item.price),
    0.0
  );

  let options;

  if (isStoreLoggedIn) {
    options = [
      { label: "Home", value: "home" },
      { label: "Dashboard", value: "store-dashboard" },
      { label: "Logout" },
    ];
  } else if (isLoggedIn) {
    options = [
      { label: "Home", value: "home" },
      { label: "Dashboard", value: "profile" },
      { label: "Store Locator", value: "storelocator" },
      { label: "Products", value: "products" },
      { label: "Cart", value: "cart" },
      { label: "Logout" },
    ];
  } else {
    options = [
      { label: "Home", value: "home" },
      { label: "Store Locator", value: "storelocator" },
      { label: "Products", value: "products" },
      { label: "Login", value: "login" },
      { label: "Register", value: "register" },
    ];
  }
    

  const handleOptionSelect = (selectedOption) => {
    if (selectedOption.label === 'Logout') {
      handleLogout();

    } else {
      console.log("Selected option:", selectedOption.label);
    }
  };

  return (
    <header className={styles.headercontainer}>
      <div className={styles.headertitle}>
        <Dropdown options={options} onSelect={handleOptionSelect} />
        <Link to="/home">
          <h1>On the Run</h1>
        </Link>
      </div>
          {isLoggedIn && 
          <Link to="/Cart" className={styles.cartLink}>
            <div className={styles.headertotal}>
              <FontAwesomeIcon icon={faShoppingCart} />
              <p>Cart Total: ${totalPrice.toFixed(2)}</p>
            </div>
          </Link>
          }
          {isLoggedIn ? (
        <div className={styles.headerRight}>
          <div className={styles.loggedIn}>
            <Link to="/profile"><h3 className={styles.username}>{user.email}</h3></Link>
            <LogoutButton />
          </div>
        </div>
      ) : isStoreLoggedIn ? (
        <div className={styles.headerRight}>
          <div className={styles.loggedIn}>
            <Link to="/store-dashboard"><h3 className={styles.username}>{store.email}</h3></Link>
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className={styles.headerRight}>
          <div className={styles.loggedOut}>
            <LoginButton />
            <RegisterButton />
          </div>
        </div>
      )}
        </header>
  );
}
