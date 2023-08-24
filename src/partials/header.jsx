import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import styles from "../styles/header.module.css";
import Dropdown from "../components/Dropdown";
import { cartContext } from "../App";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [currentOrder] = useContext(cartContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, user } = useAuth0();

  const totalPrice = Object.values(currentOrder).reduce(
    (acc, item) => acc + parseFloat(item.price),
    0.0
  );

  const options = [
    { label: "Home", value: "home" },
    { label: "Store Locator", value: "storelocator" },
    { label: "Products", value: "products" },
    { label: "Cart", value: "cart" },

    // { label: 'Sign Out', value: 'signout' },
  ];

  const handleOptionSelect = (selectedOption) => {
    console.log("Selected option:", selectedOption);
  };

  return (
    <header className={styles.headercontainer}>
      <div className={styles.headertitle}>
        <Dropdown options={options} onSelect={handleOptionSelect} />
        <Link to="/home">
          <h1>On the Run</h1>
        </Link>
      </div>

      {/* <div className={styles.themeswitchwrapper}>
        <label className={styles.themeswitch} htmlFor="checkbox">
          <input type="checkbox" id="checkbox" />
          <div className={styles.slider}></div>
        </label>
        <em id="lightDark" className={styles.em}>
          Enable Dark Mode!
        </em>
      </div> */}

          <Link to="/Cart" className={styles.cartLink}>
            <div className={styles.headertotal}>
              <FontAwesomeIcon icon={faShoppingCart} />
              <p>Cart Total: ${totalPrice.toFixed(2)}</p>
            </div>
          </Link>
      {isAuthenticated ? (
        <div className={styles.headerRight}>
          <div className={styles.loggedIn}>
            <h3 className={styles.username}>{user.name}</h3>
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className={styles.headerRight}>
          <div className={styles.loggedOut}>
            <LoginButton />
          </div>
        </div>
      )}
    </header>
  );
}
