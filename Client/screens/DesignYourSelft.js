import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import TopupModal from '../components/TopupModal';
import { useNavigation } from '@react-navigation/native'; 
import Config from 'react-native-config';

export default function DesignYourSelft() {
  const [imageUri, setImageUri] = useState(null);
  const [paintImage, setPaintImage] = useState(null);
  const [tileImage, setTileImage] = useState(null);
  const [previewImageUri, setPreviewImageUri] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [loadingRender, setLoadingRender] = useState(false);
  const [detected, setDetected] = useState(false);
  const { user, token, setUser } = useAuth();
  const [showTopupModal, setShowTopupModal] = useState(false);
  const navigation = useNavigation();
  const API_URL = Config.API_URL;

  const pickImage = (type) => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (!uri) return;

      if (type === 'house') {
        setImageUri(uri);
        setDetected(false); // reset detect flag
        setPredictions(null);
        setPreviewImageUri(null);
      }
      if (type === 'paint') setPaintImage(uri);
      if (type === 'tile') setTileImage(uri);
    });
  };

  const handleDetect = async () => {
    if (!imageUri) return Alert.alert('Thiếu ảnh', 'Chưa chọn ảnh nhà');
    try {
      setLoadingDetect(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'house.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(`${API_URL}:8001/detect`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await res.json();
      setPredictions(data.predictions);
      setDetected(true);
      Alert.alert('Thành công', 'Đã xử lý ảnh và phát hiện tường/sàn');
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể phát hiện tường/sàn');
    } finally {
      setLoadingDetect(false);
    }
  };

  const handleRender = async () => {
    if (!imageUri || !paintImage || !tileImage || !predictions) {
      return Alert.alert('Thiếu dữ liệu', 'Vui lòng chọn đủ 3 ảnh và xử lý ảnh trước');
    }


    try {
      setLoadingRender(true);

// // 🧾 Gọi API trừ count và balancess
    // const deductionResponse = await fetch(`${API_URL}:8000/use-design`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });

    // const deductionData = await deductionResponse.json();

    // if (!deductionResponse.ok) {
    //   Alert.alert('Lỗi', deductionData.message || 'Không thể trừ lượt sử dụng');
    //   setLoading(false);
    //   return;
    // }

    // // Cập nhật count + balance mới vào context (nếu có)
    // setUser(prev => ({
    //   ...prev,
    //   count: deductionData.count,
    //   balance: deductionData.balance,
    // }));

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'house.jpg',
        type: 'image/jpeg',
      });
      formData.append('wall_texture', {
        uri: paintImage,
        name: 'paint.jpg',
        type: 'image/jpeg',
      });
      formData.append('floor_texture', {
        uri: tileImage,
        name: 'tile.jpg',
        type: 'image/jpeg',
      });
      formData.append('predictions', JSON.stringify(predictions));

      const res = await fetch(`${API_URL}:8001/render_with_masks`, {
        method: 'POST',
        body: formData,
      });

      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUri(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể render ảnh');
    } finally {
      setLoadingRender(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thiết Kế Tường & Sàn</Text>

      <TouchableOpacity style={styles.button} onPress={() => pickImage('house')}>
        <Text style={styles.buttonText}>Chọn ảnh thiết kế</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

     <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ffc107' }]}
        onPress={handleDetect}
        disabled={loadingDetect}
      >
        {loadingDetect ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={[styles.buttonText, { color: '#000' }]}>Xử Lý Ảnh </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => pickImage('paint')}>
        <Text style={styles.buttonText}>Chọn ảnh màu sơn</Text>
      </TouchableOpacity>
      {paintImage && <Image source={{ uri: paintImage }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={() => pickImage('tile')}>
        <Text style={styles.buttonText}>Chọn ảnh mẫu gạch</Text>
      </TouchableOpacity>
      {tileImage && <Image source={{ uri: tileImage }} style={styles.image} />}

    <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: user.count > 0 ? '#007bff' : '#6c757d' }
        ]}
        onPress={() => {
          if (user.count > 0) {
            handleRender();
          } else {
            setShowTopupModal(true); 
          }
        }}
        disabled={!detected || loadingRender}
      >
        {loadingRender ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Xem Thiết Kế 
          {/* ({user.count})  */}
          </Text>
        )}
      </TouchableOpacity>

      {previewImageUri && (
        <>
          <Text style={styles.sectionTitle}>Kết quả thiết kế:</Text>
          <Image source={{ uri: previewImageUri }} style={styles.resultImage} />
        </>
      )}


           {/*hiển thị gói nạp khi hết lượt  */}
    <TopupModal
      visible={showTopupModal}
      onClose={() => setShowTopupModal(false)}
      onSelect={(selectedPackage) => {
        setShowTopupModal(false);
        navigation.navigate('TopupScreen', { selectedPackage });
      }}
    />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  resultImage: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginTop: 10,
  },
});
