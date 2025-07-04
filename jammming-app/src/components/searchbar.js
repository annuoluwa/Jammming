import React, { useState } from 'react';
import styles from '../css/searchbar.module.css';
function SearchBar({onSearch}) {
    console.log('SearchBar rendered')
const[search, setSearch]= useState('');

function handleChange(e) {
     console.log('Input changed to:', e.target.value);
setSearch(e.target.value)
};

function handleSearch() {

      console.log('handleSearch called with:',  search)
    onSearch(search)
};

    return(
        
        <div className={styles.container}>
            <input 
            placeholder='Enter a song title here'
            value={search}
            onChange={handleChange} className={styles.searchInput}></input>
            <button onClick={handleSearch} className={styles.searchButton}> Search </button>
        </div>
    
    )
}


export default SearchBar