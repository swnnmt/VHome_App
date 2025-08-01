import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import TopupModal from '../components/TopupModal'; // chỉnh lại path nếu cần
import { ScrollView ,Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import Config from 'react-native-config';

export default function DesignDetail({ route }) {
  const { brand , continueDesign, id_design } = route.params;
  const isEditMode = !!continueDesign;
  const { user, token, setUser } = useAuth();
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImageUri, setPreviewImageUri] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // ✅ Thêm state cho ảnh detect
  const [showTopupModal, setShowTopupModal] = useState(false);
  const API_URL = Config.API_URL;
  

// up ảnh thiết kế
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        return Alert.alert('Lỗi', response.errorMessage || 'Không thể chọn ảnh');
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        setPreviewImageUri(null);
        setPredictions(null);
        setPreviewImage(null);
      }
    });
  };
// chỉnh sửa thiết kế đã lưu
  useEffect(() => {
   console.log('Brand:', brand);
    console.log('Continue design:', continueDesign);
   

  if (isEditMode) {
    setImageUri(continueDesign.originalImage);
    setPreviewImageUri(continueDesign.designedImage);

    const paint = brand.paints.find(p => p.colorCode === continueDesign.paintCode);
    if (paint) setSelectedPaint(paint);

    const tile = brand.tiles.find(t => t.image === continueDesign.tileImage);
    if (tile) setSelectedTile(tile);
  }
}, [continueDesign, brand]);

// detect ảnh 
  const handleDetectDesign = async () => {
    if (!imageUri) return Alert.alert('Lỗi', 'Vui lòng chọn ảnh đầu vào');

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'input.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post(`${API_URL}:8001/detect`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { predictions, image } = response.data;

      setPredictions(predictions);

      setPredictions(predictions);

        if (image) {
      const dataUrl = `data:image/jpeg;base64,${image}`;
      setPreviewImage(dataUrl); // ✅ Gán vào state
      }

      Alert.alert('Thành công', 'Phát hiện tường/sàn thành công!');
    } catch (err) {
      console.error('Detect error:', err);
      Alert.alert('Lỗi', 'Không thể phát hiện tường/sàn');
    } finally {
      setLoading(false);
    }
  };
// xem thiết kế
  const handlePreviewDesign = async () => {
    if (!imageUri || !selectedPaint || !predictions) {
      return Alert.alert('Lỗi', 'Vui lòng chọn ảnh, màu sơn và detect trước!');
    }

    try {
      setLoading(true);

    // trừ count và balance start

    // // 🧾 Gọi API trừ count và balance
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

    // Cập nhật count + balance mới vào context (nếu có)
    // setUser(prev => ({
    //   ...prev,
    //   count: deductionData.count,
    //   balance: deductionData.balance,
    // }));
      //end
      

      const paintBlob = await createPaintBlob(selectedPaint.colorCode);
      const formData = new FormData();

      formData.append('image', {
        uri: imageUri,
        name: 'input.jpg',
        type: 'image/jpeg',
      });
      formData.append('wall_texture', paintBlob);
      if (selectedTile) {
        const tileResponse = await fetch(`${API_URL}:8000${selectedTile.image}`);
        const tileBlob = await tileResponse.blob();
        formData.append('floor_texture', {
          uri: `data:image/jpeg;base64,${await blobToBase64(tileBlob)}`,
          name: 'tile.jpg',
          type: 'image/jpeg',
        });
      }
      formData.append('predictions', JSON.stringify(predictions));

      const response = await fetch(`${API_URL}:8001/render_with_masks`, {
        method: 'POST',
        body: formData,
      });

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUri(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Render error:', err);
      Alert.alert('Lỗi', 'Không thể render ảnh');
    } finally {
      setLoading(false);
    }
  };
// tạo ảnh từ mã màu sơn
const createPaintBlob = async (hexColor) => {
  const response = await fetch(`${API_URL}:8001/solid_color_image?hex=${hexColor.replace('#', '')}`);
  const blob = await response.blob();
  return {
    uri: `data:image/jpeg;base64,${await blobToBase64(blob)}`,
    name: 'paint.jpg',
    type: 'image/jpeg',
  };
};

// base 64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
// lưu thiết kế
  const handleSaveDesign = async () => {
  if (!user) return Alert.alert('Lỗi', 'Bạn cần đăng nhập');
  if (!imageUri || !selectedPaint || !selectedTile || !previewImageUri) {
    return Alert.alert('Lỗi', 'Vui lòng chọn đủ thông tin và render ảnh');
  }

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append('id_user', user._id);
    formData.append('id_brand', brand._id); // ✅ thêm id_brand
    formData.append('paintCode', selectedPaint.colorCode);
    formData.append('tileImage', selectedTile.image);

    // Ảnh gốc
    formData.append('originalImage', {
      uri: imageUri,
      name: 'original.jpg',
      type: 'image/jpeg',
    });

    // Ảnh thiết kế
    const base64Data = previewImageUri.split(',')[1]; // loại bỏ prefix
    formData.append('designedImage', {
      uri: `data:image/jpeg;base64,${base64Data}`,
      name: 'designed.jpg',
      type: 'image/jpeg',
    });

    await axios.post(`${API_URL}:8000/designs`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    Alert.alert('Thành công', 'Thiết kế đã được lưu');
  } catch (error) {
    console.error('Lỗi khi lưu thiết kế:', error);
    Alert.alert('Lỗi', 'Không thể lưu thiết kế');
  } finally {
    setLoading(false);
  }
};

const navigation = useNavigation();
//update thiết kế
const handleUpdateDesign = async () => {
  if (!user) return Alert.alert('Lỗi', 'Bạn cần đăng nhập');
  if (!imageUri || !selectedPaint || !selectedTile || !previewImageUri) {
    return Alert.alert('Lỗi', 'Vui lòng chọn đủ thông tin và render ảnh');
  }

  try {
    setLoading(true);
    const formData = new FormData();

    // Các trường cần cập nhật
    formData.append('id_brand', brand._id);
    formData.append('paintCode', selectedPaint.colorCode);
    formData.append('tileImage', selectedTile.image);

    // Nếu ảnh gốc thay đổi
    formData.append('originalImage', {
      uri: imageUri,
      name: 'original.jpg',
      type: 'image/jpeg',
    });

    // Nếu ảnh thiết kế có render mới
    const base64Data = previewImageUri.split(',')[1]; // Loại bỏ prefix
    formData.append('designedImage', {
      uri: `data:image/jpeg;base64,${base64Data}`,
      name: 'designed.jpg',
      type: 'image/jpeg',
    });

    // Gửi request PUT
    await axios.put(`${API_URL}:8000/designs/${id_design}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    Alert.alert('Thành công', 'Thiết kế đã được cập nhật');
    navigation.navigate('Home');
  } catch (error) {
    console.error('Lỗi khi cập nhật thiết kế:', error);
    Alert.alert('Lỗi', 'Không thể cập nhật thiết kế');
  } finally {
    setLoading(false);
  }
};

// show màu sơn
  const renderPaint = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.colorGridItem,
        selectedPaint?._id === item._id && styles.selectedItem,
      ]}
      onPress={() => setSelectedPaint(item)}
    >
      <View style={[styles.colorBoxLarge, { backgroundColor: item.colorCode }]} />
    </TouchableOpacity>
  );
// show mẫu gạch
  const renderTile = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tileGridItem,
        selectedTile?._id === item._id && styles.selectedItem,
      ]}
      onPress={() => setSelectedTile(item)}
    >
      <Image
        source={{ uri: `${API_URL}:8000${item.image}` }}
        style={styles.tileImageGrid}
      />
    </TouchableOpacity>
  );
// tổng giá tiền
  const total = (selectedPaint?.price || 0) + (selectedTile?.price || 0);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{brand.name}</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>
          {imageUri ? 'Đổi ảnh thiết kế' : 'Chọn ảnh thiết kế'}
        </Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.selectedImage} />}

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: '#6c757d' }]}
        onPress={handleDetectDesign}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>Xử Lý Ảnh</Text>
      </TouchableOpacity>
{/* xem ảnh sau khi detect "test" */}
      {/* {previewImage && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Kết quả phát hiện:</Text>
          <Image
            source={{ uri: previewImage }}
            style={{ width: '100%', height: 220, borderRadius: 10, marginTop: 8 }}
            resizeMode="contain"
          />
        </View>
      )} */}

        {previewImageUri && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Kết quả thiết kế:
          </Text>
          <Image
            source={{ uri: previewImageUri }}
            style={{ width: '100%', height: 220, borderRadius: 10 }}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.selectionContainer}>
        <View style={styles.selectionColumn}>
          <Text style={styles.sectionTitle}>Màu sơn</Text>
          <FlatList
            data={brand.paints}
            keyExtractor={(item) => item._id}
            renderItem={renderPaint}
            numColumns={4}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.selectionColumn}>
          <Text style={styles.sectionTitle}>Mẫu gạch</Text>
          <FlatList
            data={brand.tiles}
            keyExtractor={(item) => item._id}
            renderItem={renderTile}
            numColumns={4}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
          />
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Tổng giá: {total.toLocaleString()}VND</Text>
      </View>
{/* button Xem thiết kế start */}
        <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: user.count > 0 ? '#007bff' : '#6c757d' }
        ]}
        onPress={() => {
          if (user.count > 0) {
            handlePreviewDesign();
          } else {
            setShowTopupModal(true); // 👉 Hiện modal khi hết lượt
          }
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            Xem thiết kế 
            {/* ({user.count}) */}
          </Text>
        )}
      </TouchableOpacity>


{/* button lưu thiết kế start */}

      {isEditMode? (
        <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateDesign}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>Cập nhật thiết kế</Text>
            </TouchableOpacity>
      ):(
        <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveDesign}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>Lưu thiết kế</Text>
            </TouchableOpacity>
      )}
      
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
    marginTop: 30,
    padding: 16,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectionColumn: {
    flex: 1,
  },
  colorGridItem: {
    width: '22%',
    aspectRatio: 1,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  colorBoxLarge: {
    width: '80%',
    height: '80%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
  },
  tileGridItem: {
    width: '20%',
    aspectRatio: 1,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tileImageGrid: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedItem: {
    borderColor: '#007bff',
    backgroundColor: '#eaf4ff',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  totalBox: {
    marginTop: 20,
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});
