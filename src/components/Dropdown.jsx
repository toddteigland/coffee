import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/dropdown.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons';


export default function Dropdown ({ options, onSelect }) {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    setShowOptions(false);
    onSelect(option);
  };

  const handleClickOutside = (event) => {
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)) 
      setShowOptions(false);
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>

      <div
        className={styles.dropdownHeader}
        onClick={() => setShowOptions((prevShowOptions) => !prevShowOptions)}
      >
         <FontAwesomeIcon icon={faAngleDoubleDown} size="2x" />
      </div>
      
      <ul className={`${styles.dropdownOptions} ${showOptions ? styles.show : ''}`}>
        {options.map((option) => (
          <li key={option.value} 
          onClick={() => handleOptionClick(option)}
          >
            <Link to={`/${option.value}`}>{option.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

