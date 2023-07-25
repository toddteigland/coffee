import styles from "../styles/header.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons'; 
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons'; 
import Dropdown from './Dropdown';


export default function Header() {

  const options = [
    { label: 'Store Locator', value: 'storelocator' },
    { label: 'Other Options', value: 'otheroptions'},
    { label: 'Other Options', value: 'otheroptions'},
    { label: 'Other Options', value: 'otheroptions'},
    { label: 'Sign Out', value: 'signout' },
  ];

  const handleOptionSelect = (selectedOption) => {
    console.log('Selected option:', selectedOption);
  };

  return(
    <div>

    <header className="headercontainer">
      <div className="headertitle">
        <a href="#">
        <Dropdown options={options} onSelect={handleOptionSelect} />

        </a>
          <h1>On the Run</h1>
      </div>
      <div className="headertotal">
        <FontAwesomeIcon icon={faShoppingCart} />
        <p>Cart Total:</p>
      </div>
    </header>
    
  
    </div>
  )
}