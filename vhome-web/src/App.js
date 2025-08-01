import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';

export default function App() {
  return (
    <AuthProvider>
      <BrandProvider>
        <AppNavigation />
      </BrandProvider>
    </AuthProvider>
  );
}
