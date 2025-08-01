import React, { useEffect, useState } from 'react';
import '../screens/HomeScreen.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdMenu, IoMdSearch } from 'react-icons/io';
import { FaUser } from "react-icons/fa";
import TopupModal from '../components/TopupModal'; // Đảm bảo đã import
import { useAuth } from '../context/AuthContext';


export default function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstup, setFirstup] = useState(false); // Trạng thái firstup
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
  const { user, setUser } = useAuth(); // <- thêm setUser
  // Giả sử bạn có API hoặc user context để lấy thông tin người dùng


useEffect(() => {
  const fetchUser = async () => {
    try {
      setFirstup(user.firstup);
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
    }
  };

  fetchUser();
}, [location.state?.reload]); // 👈 Đây là chìa khóa để load lại khi quay về


  const handleAiClick = () => {
    if (firstup) {
      navigate('/ai-consult');
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="background">
      {/* Navbar */}
      <div className="navbar">
        <button className="menu-button">
          <IoMdMenu size={24} />
        </button>

        <div className="search-container">
          <input className="search-input" placeholder="Tìm kiếm..." />
          <IoMdSearch size={24} />
        </div>

        <button className="avatar-button" onClick={() => navigate('/profile')}>
          <FaUser size={28} />
        </button>
      </div>

      {/* Hiệu ứng kính lúp */}
      <div className="magnifier">
        <img src="/images/background.jpg" className="magnified-image" alt="Zoomed" />
      </div>

      {/* Giới thiệu */}
      <div className="text-container">
        <h1 className="titleslogan">Mỗi nhà mỗi vibe, AI hiểu hết</h1>
      </div>

      {/* Các nút điều hướng */}
      <button className="home-btn" onClick={() => navigate('/design-with')}>
        Thiết kế theo mẫu ➝
      </button>

      <button className="home-btn" onClick={() => navigate('/design-yourself')}>
        Thiết kế tự do ➝
      </button>

        <button
          className={`home-btn ${!firstup ? 'disabled' : ''}`}
          onClick={handleAiClick}
        >
          AI tư vấn
        </button>


      <button
        className="home-btn"
        onClick={() =>
          navigate('/design-list', {
            state: { id_user: '665efc1234abc123456789de' },
          })
        }
      >
        Xem thiết kế đã lưu ➝
      </button>

      {/* Modal nạp */}
     <TopupModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(pkg) => {
          setShowModal(false);
          navigate('/topup', { state: { selectedPackage: pkg } }); // ✅ Điều hướng sang TopupScreen
        }}
      />
    </div>
  );
}
