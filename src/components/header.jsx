import styles from "../styles/header.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons'; 
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons'; 


export default function Header() {

  return(
    <header className="headercontainer">
      <div className="headertitle">
        <a href="#">
          <FontAwesomeIcon icon={faAngleDoubleDown} size="2x" />
        </a>
          <h1>On the Run</h1>
      </div>
      <div className="headertotal">
        <FontAwesomeIcon icon={faShoppingCart} />
        <p>Cart Total:</p>
      </div>
    </header>
  )
}