import React, { useState } from "react";
import axios from "axios";
import "./search.css";
import { MdOutlineSearch } from "react-icons/md";

const Search = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/search-medicine/search", {
        params: {
          query: searchTerm,
        },
      });
      // Pass the search results back to the parent component
      onSearchResults(response.data.results);
      
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };


  return (
    <div className="search-bar-wrapper" style={{ width: "400px" }}>
      <input
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        <MdOutlineSearch />
      </button>
    </div>
  );
};

export default Search;
