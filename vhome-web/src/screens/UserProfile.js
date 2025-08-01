import React, { useEffect, useState } from 'react';
import '../screens/UserProfile.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DesignNavbar from '../components/DesignNavbar';
import ChangePasswordModal from '../components/ChangePasswordModal';

export default function UserProfile() {
  const { user, setUser } = useAuth(); // <- thêm setUser
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user || !user._id) {
      alert('Không có thông tin người dùng');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}:8000/user/${user._id}`);
        if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
        const data = await res.json();
        setUserInfo(data.user);
      } catch (error) {
        alert(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleLogout = () => {
    setUser(null); // Xoá user khỏi context
    navigate('/welcome'); // Quay lại trang welcome
  };

  if (loading) {
    return (
      <div className="user-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="user-center">
        <p>Không tìm thấy người dùng.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <DesignNavbar />
      <div className="profile-card">
        <h2 className="profile-title">👤 Thông Tin Người Dùng</h2>

        <div className="profile-row">
          <span className="profile-label">👨‍💼 Họ tên:</span>
          <span className="profile-value">{userInfo.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">📧 Email:</span>
          <span className="profile-value">{userInfo.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">💰 Số tiền đã nạp:</span>
          <span className="profile-value">{userInfo.balance.toLocaleString()} VND</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">📦 Gói sử dụng:</span>
          <span className="profile-value">
            {userInfo.combo === 'pro'
              ? 'PREMIUM'
              : userInfo.combo === 'standard'
              ? 'STANDARD'
              : 'BASIC'}
          </span>
        </div>
        <div className="profile-row">
          <span className="profile-label">🔁 Số lần dùng:</span>
          <span className="profile-value">
            {userInfo.combo === 'pro' ? 'Không giới hạn (1 tháng)' : userInfo.count}
          </span>
        </div>
        <div className="profile-row">
          <span className="profile-label">📅 Ngày tạo:</span>
          <span className="profile-value">{new Date(userInfo.createdAt).toLocaleString('vi-VN')}</span>
        </div>
                {showModal && (
              <ChangePasswordModal
                onClose={() => setShowModal(false)}
                onChange={() => setShowModal(false)}
              />
            )}
            <div className="button-group">
              <button className="change-password-button" onClick={() => setShowModal(true)}>
                🔒 Đổi mật khẩu
              </button>
              <button className="logout-button" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            </div>
      </div>
    </div>
  );
}
