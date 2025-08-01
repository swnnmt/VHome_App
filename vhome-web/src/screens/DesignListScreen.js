import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import '../screens/DesignListScreen.css';
import DesignNavbar from '../components/DesignNavbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';


const DesignListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { brands } = useBrand();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get(`http://14.225.192.87:8000/designs/user/${user._id}`);
      setDesigns(response.data.data);
    } catch (err) {
      setError('Không thể tải thiết kế.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://14.225.192.87:8000/delete-design/${id}`);
      setDesigns((prev) => prev.filter((design) => design._id !== id));
    } catch (err) {
      alert('Không thể xóa thiết kế.');
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;
  if (error) return <div className="center errorText">{error}</div>;

  return (
    <div className="design-list-swiper">
      <h2 className="title" style={{ textAlign: 'center' }}>Danh sách thiết kế</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        grabCursor={true}
      >
        {designs.map((item, index) => (
          <SwiperSlide key={item._id}>
            <div className="card">
              <DesignNavbar />
              <h3 className="title">Thiết kế {index + 1} ➝</h3>

              <p className="label">Ảnh gốc:</p>
              <img src={`http://14.225.192.87:8000${item.originalImage}`} alt="original" className="image" />

              <p className="label">Ảnh đã thiết kế:</p>
              <img src={`http://14.225.192.87:8000${item.designedImage}`} alt="designed" className="image" />

              <p className="text">🎨 Mã sơn: <strong>{item.paintCode}</strong></p>
              <p className="text">🧱 Gạch: {item.tileImage.split('/').pop()}</p>
              <p className="date">🕒 {new Date(item.createdAt).toLocaleString()}</p>

              {/* <button className="continueButton" onClick={() => {
                const brand = brands.find((b) => b._id === item.id_brand);
                if (brand) {
                 navigate('/design-detail', {
                    state: {
                      brand,
                      id_design: item._id,
                      continueDesign: {
                        originalImage: `http://14.225.192.87:8000${item.originalImage}`,
                        designedImage: `http://14.225.192.87:8000${item.designedImage}`,
                        paintCode: item.paintCode,
                        tileImage: item.tileImage,
                      }
                    }
                  });

                } else {
                  alert('Không tìm thấy brand tương ứng.');
                }
              }}>
                🎨 Tiếp tục thiết kế
              </button> */}

              <button className="deleteButton" onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa thiết kế này?')) {
                  handleDelete(item._id);
                }
              }}>
                🗑️ Xóa thiết kế
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DesignListScreen;
