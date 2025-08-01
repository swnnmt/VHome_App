import React, { useState } from 'react';
import '../screens/AiConsultScreen.css';
import { callGptWithImage } from '../utils/gptApi';
import DesignNavbar from '../components/DesignNavbar';
export default function AiConsult() {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const handlePickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleConsult = async () => {
    const promptToSend = customPrompt.trim() || selectedPrompt;
    if (!promptToSend) {
      alert('Vui lòng nhập câu hỏi.');
      return;
    }

    try {
      setLoading(true);
      setResponse(null);

      const reply = await callGptWithImage(promptToSend, imageBase64);
      setResponse(reply);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consult-container">
      
 
      <h2 className="title"> <DesignNavbar/> AI Tư Vấn Thiết Kế</h2>

      <label className="upload-button">
        Chọn ảnh từ thư viện
        <input type="file" accept="image/*" onChange={handlePickImage} hidden />
      </label>

      {imageBase64 && (
        <img
          src={`data:image/jpeg;base64,${imageBase64}`}
          className="preview-image"
          alt="Preview"
        />
      )}

      <p className="label">Chọn câu hỏi mẫu:</p>
      {promptSamples.map((item, index) => (
        <div
          key={index}
          className={`prompt-button ${
            selectedPrompt === item ? 'selected' : ''
          }`}
          onClick={() => {
            setSelectedPrompt(item);
            setCustomPrompt('');
          }}
        >
          {item}
        </div>
      ))}

      <p className="label">Hoặc nhập câu hỏi tùy ý:</p>
      <textarea
        className="prompt-input"
        value={customPrompt}
        onChange={(e) => {
          setCustomPrompt(e.target.value);
          setSelectedPrompt('');
        }}
        placeholder="Nhập câu hỏi của bạn..."
      />

      <button className="consult-btn" onClick={handleConsult} disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Tư Vấn'}
      </button>

      {response && (
        <div className="response-box">
          <h4 className="response-title">Phản hồi từ AI:</h4>
          <p className="response-text">{response}</p>
        </div>
      )}
    </div>
  );
}

const promptSamples = [
  'Tôi nên chọn màu sơn nào cho phòng ngủ nhỏ?',
  'Gợi ý mẫu gạch lát nền cho phòng khách hiện đại.',
  'Tôi muốn thiết kế lại phòng bếp theo phong cách tối giản.',
  'Tôi nên phối màu như thế nào cho không gian rộng?',
  'Những xu hướng nội thất năm nay là gì?',
];
