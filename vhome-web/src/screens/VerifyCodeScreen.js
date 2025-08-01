// VerifyCodeScreen.jsx
import React, { useState } from 'react';
import './VerifyCodeScreen.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyCodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email, password, actualCode } = location.state || {};

  const [incode, setIncode] = useState('');

  const handleVerify = async () => {
    if (!incode) {
      alert('Vui lòng nhập mã xác thực.');
      return;
    }

    try {
      const res = await axios.post('http://14.225.192.87:8000/signup', {
        name,
        email,
        password,
        incode,
        aucode: actualCode,
      });

      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      console.error('Đăng ký thất bại:', err);
      alert(err.response?.data?.message || 'Lỗi server');
    }
  };

  return (
    <div className="verify-container">
      <h2 className="verify-label">Nhập mã xác thực đã gửi đến email</h2>
      <input
        className="verify-input"
        type="text"
        placeholder="Nhập mã OTP"
        value={incode}
        onChange={(e) => setIncode(e.target.value)}
      />
      <button className="verify-button" onClick={handleVerify}>
        Xác nhận
      </button>

      {/* Debug info nếu cần */}
      {/* <div className="debug-box">
        <p>Tên: {name}</p>
        <p>Email: {email}</p>
        <p>Mật khẩu: {password}</p>
        <p>Mã OTP thực tế: {actualCode}</p>
        <p>Mã người dùng nhập: {incode}</p>
      </div> */}
    </div>
  );
}
