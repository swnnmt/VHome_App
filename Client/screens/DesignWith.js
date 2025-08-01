import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBrand } from '../context/BrandContext'; // đảm bảo đúng path tới context
import Config from 'react-native-config';
export default function DesignWith({ navigation }) {
  const { brands, loading } = useBrand();
  const API_URL = Config.API_URL;
  const renderBrand = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      navigation.navigate('DesignDetail', { brand: item }); // nếu có màn hình chi tiết
    }}>
      <Image
        source={{ uri: `${API_URL}:8000${item.banner}` }}
        style={styles.banner}
        resizeMode="cover"
      />
      
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thanh navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Tìm kiếm..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>
      </View>

      {/* Nội dung màn hình */}
      <View style={styles.content}>
        <Text style={styles.title}>Thiết kế theo mẫu</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={brands}
            keyExtractor={(item) => item._id}
            renderItem={renderBrand}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 10,
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 5,
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 3,
  },
  banner: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  name: {
    padding: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});
