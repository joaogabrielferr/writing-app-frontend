'use client'

import { useState } from "react";
import styles from './search-bar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
    // Insert search logic here
  };

  return (
    <div className={styles.search_bar_container}>
      <input
        type="text"
        className={styles.search_input}
        placeholder="Search articles"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className={styles.search_button} onClick={handleSearch}>
        <svg
          className={styles.search_icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.15z"
          />
        </svg>
      </button>
    </div>
  );
}