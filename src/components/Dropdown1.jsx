import React from 'react';
import './Dropdown1.css'; // For custom styling

const Dropdown1 = () => {
  return (
    <div className="dropdown-container">
      <label htmlFor="category-select" className="dropdown-label">
       
      </label>
      <select id="category-select" className="dropdown-select">
        
        <option value="All">All</option>
        <option value="health">Health</option>
        <option value="painkillers">Painkillers</option>
        <option value="antibiotics">Antibiotics</option>
        <option value="vitamins">Vitamins</option>
        <option value="cosmetics">Cosmetics</option>
      </select>
    </div>
  );
};

export default Dropdown1;
