import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../screens/DesignDetail.css';
import { useAuth } from '../context/AuthContext';
import DesignNavbar from '../components/DesignNavbar';
import TopupModal from '../components/TopupModal';

export default function DesignDetail() {
  const { user, token, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { brand, continueDesign } = location.state || {};

 const [userInfo, setUserInfo] = useState(null);


  const isEditMode = !!continueDesign;
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImageUri, setPreviewImageUri] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showTopup, setShowTopup] = useState(false);

  useEffect(() => {
    if (!brand) {
      alert('Thiếu thông tin thiết kế');
      navigate('/design-with');
      return;
    }

    if (isEditMode) {
      const paint = brand.paints.find(p => p.colorCode === continueDesign.paintCode);
      const tile = brand.tiles.find(t => t.image === continueDesign.tileImage);
      if (paint) setSelectedPaint(paint);
      if (tile) setSelectedTile(tile);

      fetch(`${process.env.REACT_APP_API_URL}:8000${continueDesign.originalImage}`)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'originalImage.jpg', { type: blob.type });
          setImageFile(file);
        });
      setPreviewImageUri(`${process.env.REACT_APP_API_URL}:8000${continueDesign.designedImage}`);
    }
  }, [brand, continueDesign, isEditMode, navigate]);

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

  const handleDetectDesign = async () => {
    if (!imageFile) return alert('Vui lòng chọn ảnh đầu vào');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}:8001/detect`, formData);
      const { predictions, image } = response.data;
      setPredictions(predictions);
      if (image) setPreviewImage(`data:image/jpeg;base64,${image}`);
      alert('Phát hiện tường/sàn thành công!');
    } catch (err) {
      console.error(err);
      alert('Không thể phát hiện tường/sàn');
    } finally {
      setLoading(false);
    }
  };

  
  const handlePreviewDesign = async () => {
    if (!imageFile || !selectedPaint || !predictions) {
      return alert('Vui lòng chọn ảnh, màu sơn và detect trước!');
    }
    if (user?.count <= 0) {
      console.log('Hiển thị modal topup');
      setShowTopup(true);
      return;
    }
    try {
      setLoading(true);
      const deduction = await axios.post(`${process.env.REACT_APP_API_URL}:8000/use-design`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, count: deduction.data.count, balance: deduction.data.balance });

      const paintImage = await axios.get(
        `${process.env.REACT_APP_API_URL}:8001/solid_color_image?hex=${selectedPaint.colorCode.replace('#', '')}`,
        { responseType: 'blob' }
      );
      const tileImage = selectedTile
        ? await axios.get(`${process.env.REACT_APP_API_URL}:8000${selectedTile.image}`, { responseType: 'blob' })
        : null;

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('wall_texture', paintImage.data);
      if (tileImage) formData.append('floor_texture', tileImage.data);
      formData.append('predictions', JSON.stringify(predictions));

      const response = await axios.post(`${process.env.REACT_APP_API_URL}:8001/render_with_masks`, formData, { responseType: 'blob' });
      const imageBlob = response.data;
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImageUri(reader.result);
      reader.readAsDataURL(imageBlob);
    } catch (err) {
      console.error(err);
      alert('Không thể render ảnh');
    } finally {
      setLoading(false);
    }
  };

  function base64ToFile(base64Data, fileName) {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  const handleSaveDesign = async () => {
    if (!user || !imageFile || !selectedPaint || !selectedTile || !previewImageUri) {
      return alert('Thiếu thông tin thiết kế');
    }

    try {
      setLoading(true);
      const designedImageFile = base64ToFile(previewImageUri, 'designed.jpg');
      const formData = new FormData();
      formData.append('id_user', user._id);
      formData.append('id_brand', brand._id);
      formData.append('paintCode', selectedPaint.colorCode);
      formData.append('tileImage', selectedTile.image);
      formData.append('originalImage', imageFile);
      formData.append('designedImage', designedImageFile);

      await axios.post(`${process.env.REACT_APP_API_URL}:8000/designs`, formData);
      alert('Thiết kế đã được lưu');
    } catch (err) {
      console.error('Lỗi lưu thiết kế:', err);
      alert('Không thể lưu thiết kế');
    } finally {
      setLoading(false);
    }
  };

  const total = (selectedPaint?.price || 0) + (selectedTile?.price || 0);

  return (
    <div className="container">
      {showTopup && (
        <TopupModal visible={true} onClose={() => setShowTopup(false)} onSelect={(pkg) => {
          setShowTopup(false);
          navigate('/topup', { state: { selectedPackage: pkg } });
        }} />
      )}

      <h2 className="title"><DesignNavbar />{brand?.name}</h2>
      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      {imageFile && <img src={URL.createObjectURL(imageFile)} alt="selected" className="selectedImage" />}
      <button className="uploadButton" onClick={handleDetectDesign} disabled={loading}>{loading ? 'Đang xử lý...' : `Xử lý ảnh `}</button>
      {previewImageUri && <img src={previewImageUri} alt="preview" className="selectedImage" />}

      <div className="selectionContainer">
        <div className="selectionColumn">
          <h3 className="sectionTitle">Màu sơn</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {brand?.paints.map(paint => (
              <div
                key={paint._id}
                className={`colorGridItem ${selectedPaint?._id === paint._id ? 'selectedItem' : ''}`}
                onClick={() => setSelectedPaint(paint)}
              >
                <div className="colorBoxLarge" style={{ backgroundColor: paint.colorCode }} />
              </div>
            ))}
          </div>
        </div>
        <div className="selectionColumn">
          <h3 className="sectionTitle">Mẫu gạch</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {brand?.tiles.map(tile => (
              <div
                key={tile._id}
                className={`tileGridItem ${selectedTile?._id === tile._id ? 'selectedItem' : ''}`}
                onClick={() => setSelectedTile(tile)}
              >
                <img src={`${process.env.REACT_APP_API_URL}:8000${tile.image}`} alt="tile" className="tileImageGrid" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="totalBox">
        <p className="totalText">Tổng giá: {total.toLocaleString()} VND</p>
      </div>

      <button className="saveButton" onClick={handlePreviewDesign} disabled={loading}>
      {loading
        ? 'Đang xử lý...'
        : `Xem thiết kế (${
            userInfo?.combo === 'pro' ? 'PREMIUM' : userInfo?.count
          })`}
    </button>


      <button className="saveButton" onClick={handleSaveDesign} disabled={loading}>
        {isEditMode ? 'Cập nhật thiết kế' : 'Lưu thiết kế'}
      </button>
    </div>
  );
}