import React, { useState, useEffect, useRef } from 'react';
import '../styles/dropdown.css'; // Create a CSS file to style the dropdown
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export default function Dropdown ({ options }) {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    setShowOptions(false);
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
    <div className="dropdown-container" ref={dropdownRef}>

      <div
        className="dropdown-header"
        onClick={() => setShowOptions((prevShowOptions) => !prevShowOptions)}
      >
         <FontAwesomeIcon icon={faAngleDoubleDown} size="2x" />
      </div>
      
      <ul className={`dropdown-options ${showOptions ? 'show' : ''}`}>
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

