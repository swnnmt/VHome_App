// LoginScreen.jsx
import React, { useState } from 'react';
import '../screens/LoginScreen.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import googleIcon from '../assest/icons/google.png';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://14.225.192.87:8000/login', {
        email,
        password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      login(userData, token);
      navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Email hoặc mật khẩu không đúng');
      } else {
        alert(`Không thể kết nối đến server\n${JSON.stringify(error.toJSON?.(), null, 2)}`);
      }
      console.error('Lỗi đăng nhập:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Vui lòng nhập email để lấy lại mật khẩu.');
      return;
    }

    try {
      const response = await axios.post('http://14.225.192.87:8000/send-code', {
        email,
      });

      const actualCode = response.data.code;

      navigate('/reset-password', {
        state: {
          email,
          actualCode,
        },
      });
    } catch (err) {
      console.error('Lỗi gửi mã xác thực:', err);
      alert(err.response?.data?.message || 'Không thể gửi mã xác thực.');
    }
  };

  return (
    <div className="login-background">
      <div className="login-inner">
        <div className="login-header">
          <button className="login-back" onClick={() => navigate(-1)}>
            ⬅
          </button>
        </div>

        <div className="login-form-container">
          <label className="login-label">Email Address</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <label className="login-label">Password</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          <div className="login-forgot">
            <button className="forgot-link" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <button className="login-button" onClick={handleLogin}>
            Login
          </button>

          <div className="login-or">Or</div>

          <div className="login-socials">
            <button className="login-social-button">
              <img src={googleIcon} alt="Google" />
            </button>
          </div>

          <div className="login-signup">
            <span>Don't have an account?</span>
            <button className="login-signup-link" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
