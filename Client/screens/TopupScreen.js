import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Config from 'react-native-config';
const qrMap = {
  basic: require('../assest/images/20k.jpg'),
  standard: require('../assest/images/50k.jpg'),
  pro: require('../assest/images/99k.jpg'),
};

const amountMap = {
  basic: 20000,
  standard: 50000,
  pro: 99000,
};

const API_URL = Config.API_URL;

const TopupScreen = ({ route, navigation }) => {
  const { selectedPackage } = route.params;
   const { user, token, setUser } = useAuth();
 const handleConfirm = async () => {
  try {
    const response = await axios.post(
      `${API_URL}:8000/user/topup`,
      { amount: amountMap[selectedPackage.id] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert('Thành công', response.data.message);

    // 👇 Gọi API lấy lại user mới nhất
    const userRes = await axios.get(`${API_URL}:8000/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(userRes.data); // ✅ Cập nhật context với dữ liệu mới

    navigation.goBack(); // 🔙 Quay lại màn hình trước (DesignDetail)
  } catch (error) {
    console.error(error);
    Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán gói {selectedPackage.name}</Text>
      <Image source={qrMap[selectedPackage.id]} style={styles.qr} resizeMode="contain" />
      <Text style={styles.title}>{selectedPackage.price}</Text>
      <Text style={styles.note}>
        Vui lòng quét mã QR bằng app ngân hàng, chuyển đúng số tiền và ghi chú "nạp {selectedPackage.name}". Sau khi chuyển khoản, bấm nút bên dưới để xác nhận.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Tôi đã thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  qr: { width: 250, height: 250, marginBottom: 20 },
  note: { textAlign: 'center', fontSize: 16, color: '#333', marginBottom: 30 },
  button: {
    backgroundColor: '#0d47a1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
