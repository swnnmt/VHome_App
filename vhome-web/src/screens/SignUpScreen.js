// SignUpScreen.jsx
import React, { useState } from 'react';
import '../screens/SignUpScreen.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import googleIcon from '../assest/icons/google.png';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = () => {
    if (!name || !email || !password) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      alert('Email phải là địa chỉ Gmail hợp lệ.');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa và số.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    try {
      const response = await axios.post('http://14.225.192.87:8000/send-code', {
        email,
      });

      const otpCode = response.data.code; // Tạm thời dùng để debug/test

      navigate('/verify', {
        state: {
          name,
          email,
          password,
          actualCode: otpCode, // gửi sang màn xác thực
        },
      });
    } catch (error) {
      console.error('Lỗi gửi mã xác thực:', error);
      alert('Không thể gửi mã xác thực.');
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-inner">
        <div className="signup-form-container">
          <label className="signup-label">Full Name</label>
          <input
            className="signup-input"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="signup-label">Email Address</label>
          <input
            className="signup-input"
            placeholder="Enter Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="signup-label">Password</label>
          <div className="signup-password-wrapper">
            <input
              className="signup-input"
              placeholder="Enter Password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          <button className="signup-button" onClick={handleSignUp}>
            Sign Up
          </button>

          <div className="signup-or">Or</div>

          <div className="signup-socials">
            <button className="signup-social-button">
              <img src={googleIcon} alt="Google" />
            </button>
          </div>

          <div className="signup-bottom">
            <span>Already have an account?</span>
            <button
              onClick={() => navigate('/login')}
              className="signup-login-link"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
