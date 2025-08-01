import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await axios.get('http://14.225.192.87:8000/brands');
      setBrands(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider value={{ brands, loading }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
