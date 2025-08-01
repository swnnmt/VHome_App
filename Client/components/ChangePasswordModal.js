import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useAuth } from '../context/AuthContext';

export default function ChangePasswordModal({ visible, onClose }) {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = Config.API_URL;

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage('❗ Vui lòng nhập đầy đủ mật khẩu');
      return;
    }

    if (!API_URL) {
      setMessage('❌ Lỗi cấu hình môi trường (API_URL)');
      return;
    }

    if (!token) {
      setMessage('❗ Bạn chưa đăng nhập');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}:8000/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('📦 Server response:', response.data);
      setMessage('✅ Đổi mật khẩu thành công!');
      setTimeout(() => {
        setMessage('');
        onClose(); // đóng modal
      }, 1000);
    } catch (error) {
      console.error('❌ Lỗi đổi mật khẩu:', error);
      if (error.response) {
        const serverMessage = error.response.data?.message || '❌ Lỗi từ máy chủ';
        setMessage(serverMessage);
      } else {
        setMessage('❌ Lỗi kết nối server');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>🔐 Đổi mật khẩu</Text>

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu hiện tại"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {message ? (
            <Text
              style={{
                color: message.includes('✅') ? 'green' : 'red',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              {message}
            </Text>
          ) : null}

          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={handleChangePassword} style={styles.saveButton}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
