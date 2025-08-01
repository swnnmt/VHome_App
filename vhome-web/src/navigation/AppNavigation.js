import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from '../screens/HomeScreen';
import Welcome from '../screens/WelcomeScreen';
import Login from '../screens/LoginScreen';
import SignUp from '../screens/SignUpScreen';
import DesignWith from '../screens/DesignWith';
import DesignDetail from '../screens/DesignDetail';
import DesignList from '../screens/DesignListScreen';
import UserProfile from '../screens/UserProfile';
import DesignYourSelf from '../screens/DesignYourSelft';
import AiConsult from '../screens/AiConsultScreen';
import Topup from '../screens/TopupScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import { useAuth } from '../context/AuthContext';

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Authenticated user routes */}
        {user ? (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/design-with" element={<DesignWith />} />
            <Route path="/design-detail/:id" element={<DesignDetail />} />
            <Route path="/design-list" element={<DesignList />} />
            <Route path="/design-yourself" element={<DesignYourSelf />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/ai-consult" element={<AiConsult />} />
            <Route path="/topup" element={<Topup />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/welcome" />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<VerifyCodeScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
