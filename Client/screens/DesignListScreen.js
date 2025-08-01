import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import Config from 'react-native-config';

const DesignListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { brands } = useBrand();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = Config.API_URL;
  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get(`${API_URL}:8000/designs/user/${user._id}`);
      setDesigns(response.data.data);
    } catch (err) {
      console.error('Lỗi khi fetch:', err);
      setError('Không thể tải thiết kế.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}:8000/delete-design/${id}`);
      setDesigns(prev => prev.filter(design => design._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa thiết kế:', err);
      Alert.alert('Lỗi', 'Không thể xóa thiết kế.');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa thiết kế này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', onPress: () => handleDelete(id), style: 'destructive' }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Thiết kế</Text>

      <Text style={styles.label}>Ảnh gốc:</Text>
      <Image
        source={{ uri: `${API_URL}:8000${item.originalImage}` }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.label}>Ảnh đã thiết kế:</Text>
      <Image
        source={{ uri: `${API_URL}:8000${item.designedImage}` }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.text}>🎨 Mã sơn: <Text style={{ fontWeight: 'bold' }}>{item.paintCode}</Text></Text>
      <Text style={styles.text}>🧱 Gạch: {item.tileImage.split('/').pop()}</Text>
      <Text style={styles.date}>🕒 Tạo lúc: {new Date(item.createdAt).toLocaleString()}</Text>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          const brand = brands.find(b => b._id === item.id_brand);
          const id_design = item._id;
          if (brand) {
            navigation.navigate('DesignDetail', {
              brand,
              id_design,
              continueDesign: {
                originalImage: `${API_URL}:8000${item.originalImage}`,
                designedImage: `${API_URL}:8000${item.designedImage}`,
                paintCode: item.paintCode,
                tileImage: item.tileImage,
              },
            });
          } else {
            Alert.alert('Lỗi', 'Không tìm thấy brand tương ứng.');
          }
        }}
      >
        <Text style={styles.continueButtonText}>🎨 Tiếp tục thiết kế</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Text style={styles.deleteButtonText}>🗑️ Xóa thiết kế</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={designs}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#777',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DesignListScreen;
