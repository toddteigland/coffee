import styles from "../styles/header.css";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";
import { cartContext } from "../App";
import { Link } from "react-router-dom";

export default function Header() {
  const [currentOrder] = useContext(cartContext);
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
    <div>
      <header className="headercontainer">
        <div className="headertitle">
          <Dropdown options={options} onSelect={handleOptionSelect} />
          <h1>On the Run</h1>
        </div>
        <Link to="/Cart" className="cartLink">
          <div className="headertotal">
            <FontAwesomeIcon icon={faShoppingCart} />
            <p>Cart Total: ${totalPrice.toFixed(2)}</p>
          </div>
        </Link>
      </header>
    </div>
  );
}
