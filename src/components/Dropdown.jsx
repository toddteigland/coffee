import React, { useState, useEffect, useRef } from 'react';
import '../styles/dropdown.css'; // Create a CSS file to style the dropdown
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons'; 

export default function Dropdown ({ options, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option); // Pass the selected option back to the parent component if needed
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
          <li key={option.value} onClick={() => handleOptionClick(option)}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

