import React, { useState } from 'react';
import './SearchingInformationPanel.css';

function SearchingInformationPanel({ onSearch }) {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(location);
  };

  return (
    <div className="search-panel">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Enter filter"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchingInformationPanel;