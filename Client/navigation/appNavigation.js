import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { useAuth } from '../context/AuthContext';
import DesignWith from '../screens/DesignWith';
import DesignDetail from '../screens/DesignDetail';
import DesignListScreen from '../screens/DesignListScreen';
import UserProfile from '../screens/UserProfile';
import DesignYourSelft from '../screens/DesignYourSelft';
import AiConsultScreen from '../screens/AiConsultScreen';
import TopupScreen from '../screens/TopupScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Welcome'}>
        {user ? (
          <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DesignWith" component={DesignWith} options={{ headerShown: false }} />
          <Stack.Screen name="DesignDetail" component={DesignDetail} options={{ title: 'Thiết kế' }} />
          <Stack.Screen name="DesignListScreen" component={DesignListScreen} options={{ title: 'Thư viện' }} />
          <Stack.Screen name="DesignYourSelft" component={DesignYourSelft} options={{ title: 'Khách hàng thiết kế' }} />
          <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'Profile' }} />
          <Stack.Screen name="AiConsultScreen" component={AiConsultScreen} options={{ title: 'AI Tư Vấn Thiết Kế' }}  />
          <Stack.Screen name="TopupScreen" component={TopupScreen} />
          
          </>
          
        ) : (
          <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ title: 'Đặt lại mật khẩu' }} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// 