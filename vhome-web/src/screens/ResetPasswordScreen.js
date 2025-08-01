// ResetPasswordScreen.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ResetPasswordScreen.css';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, actualCode } = location.state || {};

  const [incode, setIncode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!incode || !newPassword) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      await axios.post('http://14.225.192.87:8000/reset-password', {
        email,
        incode,
        aucode: actualCode,
        newPassword,
      });

      alert('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (err) {
      console.error('Reset password error:', err);
      alert(err.response?.data?.message || 'Không thể đặt lại mật khẩu.');
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-label">Nhập mã xác thực đã gửi đến email</h2>
      <input
        type="text"
        placeholder="Mã xác thực"
        value={incode}
        onChange={(e) => setIncode(e.target.value)}
        className="reset-input"
      />

      <h2 className="reset-label">Mật khẩu mới</h2>
      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="reset-input"
      />

      <button className="reset-button" onClick={handleResetPassword}>
        Đặt lại mật khẩu
      </button>
    </div>
  );
}
