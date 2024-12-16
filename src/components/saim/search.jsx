import React from 'react';
import './search.css' // Create a CSS file for styling if needed
import { MdOutlineSearch } from "react-icons/md";

const search = () => {
  return (
    <div className="search-bar-wrapper" style={{width: '400px'}}>
      <input
        type="text"
        className="search-input"
        placeholder="Search"
      />
      <button className="search-button">
        <i className="fa fa-search" aria-hidden="true"></i>
        <MdOutlineSearch />
      </button>
    </div>
  );
};

export default search;
