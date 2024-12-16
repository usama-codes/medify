import { useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function SearchBar({ onSearch, onFocus, onBlur, searchResults, onBack, placeholder="Search..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(searchTerm);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="searchBar">
        <div className="searchInputWrapper">
          {searchResults ? (
            <FontAwesomeIcon 
            icon={faArrowLeft} 
            className="leftArrow" 
            size="lg" 
            onClick={() => {
              setSearchTerm('');
              onBack();
            }}
            style={{ cursor: 'pointer' }} />
          ) : (
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" size="lg" />
          )}
          <input
            type="text"
            id="bar"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={(event) => {
              placeholder = '';
              if (onFocus) onFocus(event);
            }}
            onBlur={(event) => {
              placeholder = 'Search...';
              if (onBlur) onBlur(event);
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default SearchBar;