import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Config from 'react-native-config';

const BrandContext = createContext();
const API_URL = Config.API_URL;

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_URL}:8000/brands`);
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
