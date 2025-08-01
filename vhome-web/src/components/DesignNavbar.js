// components/DesignNavbar.js
import React from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function DesignNavbar({ searchText, setSearchText }) {
  const navigate = useNavigate();

  return (
    <div className="design-navbar">
      <button className="design-back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={18} />
      </button>

      <div className="design-search-box">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>
    </div>
  );
}
