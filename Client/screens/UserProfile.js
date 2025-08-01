import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from '../components/ChangePasswordModal';

const UserProfile = () => {
  const { user, logout ,token} = useAuth(); // Thêm logout
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const API_URL = Config.API_URL;

  useEffect(() => {
    if (!user || !user._id) {
      Alert.alert('Lỗi', 'Không có thông tin người dùng');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      
      try {
        const res = await fetch(`${API_URL}:8000/user/${user._id}`);
        if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
        const data = await res.json();
        setUserInfo(data.user);
      } catch (error) {
        Alert.alert('Lỗi', error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy người dùng.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Thông Tin Người Dùng</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Họ tên:</Text>
          <Text style={styles.value}>{userInfo.name}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#28A745" style={styles.icon} />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userInfo.email}</Text>
        </View>

        {/* <View style={styles.row}>
          <Ionicons name="wallet-outline" size={22} color="#FFC107" style={styles.icon} />
          <Text style={styles.label}>Số dư:</Text>
          <Text style={styles.value}>{userInfo.balance.toLocaleString()} VND</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="repeat-outline" size={22} color="#17A2B8" style={styles.icon} />
          <Text style={styles.label}>Số lần dùng:</Text>
          <Text style={styles.value}>
            {userInfo.combo === 'pro' ? 'Không giới hạn (1 tháng)' : userInfo.count}
          </Text>
        </View> */}

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={22} color="#6C757D" style={styles.icon} />
          <Text style={styles.label}>Ngày tạo:</Text>
          <Text style={styles.value}>
            {new Date(userInfo.createdAt).toLocaleString('vi-VN')}
          </Text>
        </View>

        {/* Nút hành động */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.buttonText}>🔒 Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>🚪 Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal đổi mật khẩu */}
      {showModal && (
        <ChangePasswordModal
          onClose={() => setShowModal(false)}
          onChange={() => setShowModal(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    marginRight: 6,
  },
  value: {
    color: '#000',
    fontSize: 16,
    flexShrink: 1,
  },
  buttonGroup: {
    flexDirection: 'column',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default UserProfile;
