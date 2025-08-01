import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../context/BrandContext';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import '../screens/DesignWith.css';
import DesignNavbar from '../components/DesignNavbar'; 

export default function DesignWith() {
  const navigate = useNavigate();
  const { brands = [], loading } = useBrand(); // fallback rỗng nếu undefined
  const [searchText, setSearchText] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="design-container">
      <DesignNavbar searchText={searchText} setSearchText={setSearchText} />

      {/* Content */}
      <div className="design-content">
        <h2 className="design-title">Thiết kế theo mẫu</h2>

        {loading ? (
          <div className="design-loading">Đang tải...</div>
        ) : filteredBrands.length === 0 ? (
          <div className="design-empty">Không tìm thấy thương hiệu phù hợp</div>
        ) : (
          <div className="design-grid">
            {filteredBrands.map((item) => (
              <div
                key={item._id}
                className="design-card"
                onClick={() => navigate(`/design-detail/${item._id}`, { state: { brand: item } })}

              >
                <img
                  src={`http://14.225.192.87:8000${item.banner}`}
                  alt={item.name}
                  className="design-banner"
                />
                <div className="design-name">{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
