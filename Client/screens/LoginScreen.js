import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Config from 'react-native-config';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = Config.API_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}:8000/login`, {
        email,
        password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      login(userData, token);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng');
      } else {
        Alert.alert('Lỗi', `Không thể kết nối đến server\n${JSON.stringify(error.toJSON?.(), null, 2)}`);
      }
      console.error('Lỗi đăng nhập:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email để lấy lại mật khẩu.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}:8000/send-code`, { email });
      const actualCode = response.data.code;

      navigation.navigate('ResetPasswordScreen', {
        email,
        actualCode,
      });
    } catch (err) {
      console.error('Lỗi gửi mã xác thực:', err);
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể gửi mã xác thực.');
    }
  };

  return (
    <ImageBackground
      source={require('../assest/images/bg_login.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                {/* Có thể thêm icon quay lại nếu cần */}
              </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#6b7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.forgotPasswordWrapper} onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.signupWrapper}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupLink}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  bottomContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 48,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    color: '#4b5563',
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    borderRadius: 24,
    marginBottom: 12,
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#4b5563',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
