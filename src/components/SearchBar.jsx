import { useState } from 'react';
import '../App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [placeholder, setPlaceholder] = useState('Search...')

function handleSubmit() {
    console.log(searchTerm);
}
  return (
    <div>
        <form onSubmit={handleSubmit} className="searchBar">
            <div className="searchInputWrapper">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" size="lg" />
                <input
                    type="text"
                    id="bar"
                    placeholder={placeholder}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onFocus={() => setPlaceholder('')}
                    onBlur={() => setPlaceholder('Search...')}
                />
            </div>
        </form>

    </div>
  )
}

export default SearchBar
