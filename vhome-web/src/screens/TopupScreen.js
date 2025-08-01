import React, { useEffect, useState } from 'react';
import '../screens/TopupScreen.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import img10k from '../assest/images/10.jpg';
import img20k from '../assest/images/20.jpg';
import img99k from '../assest/images/90.jpg';

const qrMap = {
  basic: img10k,
  standard: img20k,
  pro: img99k,
};

const amountMap = {
  basic: 10000,
  standard: 20000,
  pro: 99000,
};

export default function TopupScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage;

  const { token, setUser } = useAuth();

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // Bắt đầu đếm 2 phút sau khi component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfirmButton(true);
    }, 1 * 60 * 1000); //1 phút = 60000 ms

    return () => clearTimeout(timer); // Dọn dẹp khi unmount
  }, []);

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        'http://14.225.192.87:8000/user/topup',
        { amount: amountMap[selectedPackage.id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      const userRes = await axios.get('http://14.225.192.87:8000/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);
      navigate(-1); // Chuyển hướng đến trang thiết kế
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  if (!selectedPackage) {
    return <div className="topup-container">Không tìm thấy gói nạp</div>;
  }

  return (
    <div className="topup-container">
      <h2 className="topup-title">Thanh toán gói {selectedPackage.name}</h2>
      <img src={qrMap[selectedPackage.id]} alt="QR Code" className="topup-qr" />
      <p className="topup-price">{selectedPackage.price}</p>
      <p className="topup-note">
        Vui lòng quét mã QR bằng app ngân hàng, chuyển đúng số tiền và ghi chú "nạp{' '}
        {selectedPackage.name}".
      </p>

      {showConfirmButton ? (
        <button className="topup-button" onClick={handleConfirm}>
          Thanh toán thành công
        </button>
      ) : (
        <p className="waiting-message">Đang chờ xác nhận... </p>
      )}
    </div>
  );
}
