import React, { useState } from 'react';
import '../components/ChangePasswordModal.css'; // tạo file CSS riêng nếu cần

export default function ChangePasswordModal({ onClose, onChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      setMessage('Vui lòng nhập đầy đủ');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // lấy token từ localStorage
      const res = await fetch(`${process.env.REACT_APP_API_URL}:8000/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Lỗi khi đổi mật khẩu');
      } else {
        setMessage('✅ Đổi mật khẩu thành công!');
        setTimeout(() => {
          onChange();
        }, 1000);
      }
    } catch (err) {
      setMessage('Lỗi kết nối server');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>🔐 Đổi Mật Khẩu</h3>
        <input
          type="password"
          placeholder="Mật khẩu hiện tại"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {message && <p className="modal-message">{message}</p>}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Lưu</button>
          <button onClick={onClose} className="cancel-btn">Hủy</button>
        </div>
      </div>
    </div>
  );
}
