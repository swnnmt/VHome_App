import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

const VerifyCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const API_URL = Config.API_URL;

  const { name, email, password, actualCode } = route.params;
  const [incode, setIncode] = useState('');

  const handleVerify = async () => {
    if (!incode) return Alert.alert('Vui lòng nhập mã xác thực.');

    try {
      const res = await axios.post(`${API_URL}:8000/signup`, {
        name,
        email,
        password,
        incode,
        aucode: actualCode,
      });

      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Đăng ký thất bại:', err);
      Alert.alert('Thất bại', err.response?.data?.message || 'Lỗi server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập mã xác thực đã gửi đến email</Text>
      <TextInput
        style={styles.input}
        value={incode}
        onChangeText={setIncode}
        placeholder="Nhập mã OTP"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

    {/* <View style={{ marginTop: 20 }}>
      <Text style={styles.debugTitle}>Dữ liệu đang truyền:</Text>
      <Text style={styles.debugText}>Tên: {name}</Text>
      <Text style={styles.debugText}>Email: {email}</Text>
      <Text style={styles.debugText}>Mật khẩu: {password}</Text>
      <Text style={styles.debugText}>Mã xác thực thực tế (actualCode): {actualCode}</Text>
      <Text style={styles.debugText}>Mã người dùng nhập (incode): {incode}</Text>
    </View> */}

    </View>
  );
};

export default VerifyCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
