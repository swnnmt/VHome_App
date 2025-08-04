# 🏠 VHome – Ứng dụng thiết kế nội thất thông minh với AI & Xử lý ảnh

**VHome** là một ứng dụng di động tích hợp AI, giúp người dùng thiết kế nội thất cho căn phòng thật bằng cách **tải ảnh phòng, chọn màu sơn và mẫu gạch**, sau đó hệ thống sẽ **render lại không gian** với hình ảnh thay đổi cực kỳ chân thực.

---

## ✨ Mục tiêu dự án

Xây dựng một nền tảng hỗ trợ người không chuyên có thể hình dung được căn phòng của mình sẽ trông như thế nào sau khi **sơn lại tường**, **thay gạch nền** – tất cả chỉ bằng một bức ảnh và công nghệ AI.

---

## 🚀 Tính năng nổi bật

- 📤 **Tải ảnh thật căn phòng** (qua thiết bị di động)
- 🧠 **AI phát hiện tường & sàn** từ ảnh (sử dụng Roboflow + Computer Vision)
- 🎨 **Chọn mẫu gạch và màu sơn** từ thư viện hệ thống
- 🖼️ **Render ảnh preview** căn phòng sau khi thay gạch/sơn (OpenCV xử lý ảnh)
- 📁 **Tùy chọn tải ảnh gạch/sơn cá nhân** để thử trực tiếp
- 🤖 **AI tư vấn thiết kế nội thất** phù hợp với không gian, theo phong cách mong muốn (GPT-4o API)

---

## 🛠️ Công nghệ sử dụng

-💡 AI & Vision :Roboflow (YOLOv8), OpenCV, GPT-4o, FastAPI 
- 📱 Mobile Frontend: React Native (UI, hình ảnh, preview) 
- 🧠 AI Backend: FastAPI (Python) – xử lý ảnh và tư vấn
- 🌐 Main Backend: Node.js (Express) – quản lý người dùng, dịch vụ
- ☁️ DevOps :Ubuntu 22.04 VPS, Nginx, PM2, MongoDB
 
---

## 📸 Minh họa tính năng

<img src="./assets/ảnh%20gốc.jpg" width="300" />  
<img src="./assets/Ảnh%20sau%20thiết%20kế.jpg" width="300" />

---

## 📱 Các màn hình của ứng dụng

<img src="./assets/1.%20Màn%20hình%20welcome.jpg" width="300" />  
<img src="./assets/2.%20Màn%20hình%20đăng%20ký.jpg" width="300" />  
<img src="./assets/3.%20Màn%20hình%20đăng%20nhập.jpg" width="300" />  
<img src="./assets/4.%20Quên%20mật%20khẩu.jpg" width="300" />  
<img src="./assets/5.%20Thông%20tin%20người%20dùng.jpg" width="300" />  
<img src="./assets/6.%20Thiết%20kế%20theo%20mẫu%20hoàn%20thành.jpg" width="300" />  
<img src="./assets/6.%20Thiết%20kế%20theo%20mẫu.jpg" width="300" />  
<img src="./assets/7.%20Thiết%20kế%20tự%20do%20hoàn%20thành.jpg" width="300" />  
<img src="./assets/7.%20Thiết%20kế%20tự%20do.jpg" width="300" />  
<img src="./assets/8.%20Xem%20lại%20thiết%20kế%20đã%20lưu.jpg" width="300" />  
<img src="./assets/9.%20AI%20tư%20vấn.jpg" width="300" />



---

## 🧠 Cách hoạt động (kiến trúc hệ thống)

1. Người dùng tải ảnh thật lên app (React Native)
2. Gửi ảnh đến AI backend (FastAPI) → dùng Roboflow detect tường/sàn
3. Người dùng chọn mẫu gạch/sơn → gửi yêu cầu render ảnh
4. FastAPI xử lý ảnh → trả về ảnh kết quả preview
5. Người dùng có thể lưu lại hoặc yêu cầu AI tư vấn thêm phong cách thiết kế (GPT-4o)

---

## 📦 Triển khai & môi trường

- Hệ thống được triển khai trên **Ubuntu VPS** (Docker + PM2)
- Backend sử dụng **Node.js** và **FastAPI** chạy song song
- MongoDB lưu trữ thông tin người dùng, thiết kế, hình ảnh
- File ảnh lưu qua hệ thống file hoặc cloud (tùy cấu hình)

---

## 👨‍💻 Vai trò & đóng góp cá nhân

- Thiết kế kiến trúc tổng thể, tích hợp giữa Node.js và FastAPI
- Xây dựng mô hình xử lý ảnh với Roboflow và OpenCV
- Phát triển giao diện React Native cho trải nghiệm người dùng tối ưu
- Tích hợp OpenAI GPT-4o để tư vấn thiết kế theo ngữ cảnh người dùng
- Tự tay triển khai DevOps: VPS Ubuntu, Nginx reverse proxy, domain & bảo mật

---

> 🔗 Dự án này là minh chứng cho khả năng kết hợp giữa **AI + Xử lý ảnh + UX/UI di động**, phù hợp với vai trò **AI Developer**, **Fullstack Developer**, hoặc **Mobile Developer tích hợp AI**.

