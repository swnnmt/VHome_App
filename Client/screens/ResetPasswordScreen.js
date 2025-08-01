import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

const ResetPasswordScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const API_URL = Config.API_URL;

  const [incode, setIncode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { email, actualCode } = params;

  const handleResetPassword = async () => {
    if (!incode || !newPassword) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
    }

    try {
      const res = await axios.post(`${API_URL}:8000/reset-password`, {
        email,
        incode,
        aucode: actualCode,
        newPassword,
      });

      Alert.alert('Thành công', 'Đặt lại mật khẩu thành công!');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Reset password error:', err);
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể đặt lại mật khẩu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập mã xác thực đã gửi đến email</Text>
      <TextInput
        style={styles.input}
        value={incode}
        onChangeText={setIncode}
        placeholder="Mã xác thực"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Mật khẩu mới"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

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
