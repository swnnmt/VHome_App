import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../screens/WelcomeScreen.css';
import welcomeImage from '../assest/images/welcome_img.jpg';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="welcome-background" style={{ backgroundImage: `url(${welcomeImage})` }}>
      <div className="welcome-container">
        <h1 className="welcome-title">Let's Get Started!</h1>

        <div className="welcome-buttons">
          <button className="signup-button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>

          <div className="login-row">
            <span className="login-text">Already have an account?</span>
            <button className="login-link" onClick={() => navigate('/login')}>
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
