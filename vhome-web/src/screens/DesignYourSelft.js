import React, { useState } from 'react';
import '../screens/DesignYourSelft.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopupModal from '../components/TopupModal';
import DesignNavbar from '../components/DesignNavbar';

export default function DesignYourSelft() {
  const [imageFile, setImageFile] = useState(null);
  const [paintFile, setPaintFile] = useState(null);
  const [tileFile, setTileFile] = useState(null);
  const [previewImageUri, setPreviewImageUri] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [loadingRender, setLoadingRender] = useState(false);
  const [detected, setDetected] = useState(false);
  const { user, token, setUser } = useAuth();
  const [showTopupModal, setShowTopupModal] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'house') {
      setImageFile(file);
      setDetected(false);
      setPredictions(null);
      setPreviewImageUri(null);
    }
    if (type === 'paint') setPaintFile(file);
    if (type === 'tile') setTileFile(file);
  };

  const handleDetect = async () => {
    if (!imageFile) return alert('Vui lòng chọn ảnh nhà');

    setLoadingDetect(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://14.225.192.87:8001/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setPredictions(data.predictions);
      setDetected(true);
      alert('✓ Đã phát hiện tường/sàn thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi phát hiện tường/sàn');
    } finally {
      setLoadingDetect(false);
    }
  };

  const handleRender = async () => {
    if (!imageFile || !paintFile || !tileFile || !predictions) {
      return alert('Vui lòng chọn đầy đủ ảnh và xử lý ảnh trước');
    }

    try {
      setLoadingRender(true);

      // Trừ lượt
      const deductionResponse = await fetch('http://14.225.192.87:8000/use-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const deductionData = await deductionResponse.json();
      if (!deductionResponse.ok) {
        alert(deductionData.message || 'Không thể trừ lượt sử dụng');
        return;
      }

      setUser(prev => ({
        ...prev,
        count: deductionData.count,
        balance: deductionData.balance,
      }));

      // Gửi render
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('wall_texture', paintFile);
      formData.append('floor_texture', tileFile);
      formData.append('predictions', JSON.stringify(predictions)); // ✅ Đã sửa: predictions là chuỗi, không phải Blob

      const res = await fetch('http://14.225.192.87:8001/render_with_masks', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Backend trả về lỗi: ${errText}`);
      }

      const blob = await res.blob();
      const imgURL = URL.createObjectURL(blob);
      setPreviewImageUri(imgURL);
    } catch (err) {
      console.error('Lỗi khi render ảnh:', err);
      alert('Không thể hiển thị ảnh kết quả');
    } finally {
      setLoadingRender(false);
    }
  };

  return (
    <div className="design-form">

       

      <h2> <DesignNavbar/>Thiết Kế Tường & Sàn</h2>

      <label className="upload-label">
        Chọn ảnh thiết kế:
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'house')} />
      </label>
      {imageFile && <img src={URL.createObjectURL(imageFile)} alt="house" className="preview-img" />}

      <button className="btn yellow" onClick={handleDetect} disabled={loadingDetect}>
        {loadingDetect ? 'Đang xử lý...' : 'Xử Lý Ảnh'}
      </button>

      <label className="upload-label">
        Chọn ảnh màu sơn:
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'paint')} />
      </label>
      {paintFile && <img src={URL.createObjectURL(paintFile)} alt="paint" className="preview-img" />}

      <label className="upload-label">
        Chọn ảnh mẫu gạch:
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'tile')} />
      </label>
      {tileFile && <img src={URL.createObjectURL(tileFile)} alt="tile" className="preview-img" />}

      <button
        className="btn blue"
        onClick={() => (user.count > 0 ? handleRender() : setShowTopupModal(true))}
        disabled={!detected || loadingRender}
      >
        {loadingRender ? 'Đang thiết kế...' : `Xem Thiết Kế (${user.count})`}
      </button>

      {previewImageUri && (
        <>
          <h4>Kết quả thiết kế:</h4>
          <img
            src={previewImageUri}
            alt="Kết quả thiết kế"
            className="result-img"
            onError={(e) => {
              console.error('Không thể hiển thị ảnh kết quả');
              e.target.style.display = 'none';
            }}
          />
        </>
      )}

      {showTopupModal && (
        <TopupModal
          visible={showTopupModal}
          onClose={() => setShowTopupModal(false)}
          onSelect={(selectedPackage) => {
            setShowTopupModal(false);
            navigate('/topup', { state: { selectedPackage } });
          }}
        />
      )}
    </div>
  );
}
