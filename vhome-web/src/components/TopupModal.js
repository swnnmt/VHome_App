import React from 'react';
import '../components/TopupModal.css'; // ✅ import CSS thường

const packages = [
  {
    id: 'basic',
    name: 'BASIC',
    price: '10.000VND',
    storage: '2 lượt',
    features: ['2 lượt thiết kế', 'AI tư vấn', 'Màu sơn, mẫu gạch đa dạng'],
    color: '#f6a623',
  },
  {
    id: 'standard',
    name: 'STANDARD',
    price: '20.000VND',
    storage: '5 lượt',
    features: ['5 lượt thiết kế', 'AI tư vấn', 'Màu sơn, mẫu gạch đa dạng'],
    color: '#2196f3',
  },
  {
    id: 'pro',
    name: 'PREMIUM',
    price: '99.000VND',
    storage: 'Không giới hạn 1 tháng',
    features: ['Không giới hạn lượt thiết kế 1 tháng', 'AI tư vấn', 'Màu sơn, mẫu gạch đa dạng'],
    color: '#0d47a1',
  },
];

export default function TopupModal({ visible, onClose, onSelect }) {
  if (!visible) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <h2 className="title">Chọn gói nạp</h2>
        <div className="packageRow">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="packageBox"
              style={{ backgroundColor: pkg.color }}
              onClick={() => onSelect(pkg)}
            >
              <h3 className="packageTitle">{pkg.name}</h3>
              <p className="packagePrice">{pkg.price}</p>
              <p className="packageStorage">{pkg.storage}</p>
              <ul className="featureList">
                {pkg.features.map((f, i) => (
                  <li key={i} className="featureItem">✓ {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="cancelButton">Hủy</button>
      </div>
    </div>
  );
}
