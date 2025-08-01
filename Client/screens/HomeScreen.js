import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'


const { width, height } = Dimensions.get('window')



export default function HomeScreen({ navigation }) {


  return (
    <ImageBackground
      source={require('../assest/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Thanh điều hướng (menu + tìm kiếm) */}
      <View style={styles.navbar}>
        {/* Icon menu */}
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Ô tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Tìm kiếm..."
            placeholderTextColor="#ccc"
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
        </View>

      {/* Nút avatar dẫn đến UserProfile */}
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => navigation.navigate('UserProfile')}
      >
        <Ionicons name="person-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>
      </View>

      {/* Hiệu ứng kính lúp mô phỏng */}
      <View style={styles.magnifier}>
        <ImageBackground
          source={require('../assest/images/background.jpg')}
          style={styles.magnifiedImage}
          resizeMode="cover"
        />
      </View>

      {/* Văn bản giới thiệu */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Biến ý tưởng thành{"\n"}không gian hoàn hảo</Text>
        <Text style={styles.subtitle}>Turn ideas into perfect spaces</Text>
      </View>

      {/* Nút hành động */}
      <TouchableOpacity
        style={styles.button1}
        onPress={() => navigation.navigate('DesignWith')}
      >
        <Text style={styles.buttonText}>Thiết kế theo mẫu ➝</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button2}
        onPress={() => navigation.navigate('DesignYourSelft')}
      >
        <Text style={styles.buttonText}>Thiết kế tự do ➝</Text>
      </TouchableOpacity>

 <TouchableOpacity
        style={styles.button1}
        onPress={() => navigation.navigate('AiConsultScreen')}
      >
        <Text style={styles.buttonText}>AI tư vấn</Text>
      </TouchableOpacity>

          <TouchableOpacity
      style={styles.button3}
      onPress={() => navigation.navigate('DesignListScreen', { id_user: '665efc1234abc123456789de' })}
    >
      <Text style={styles.buttonText}>Xem thiết kế đã lưu ➝</Text>
    </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navbar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff30',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginLeft: 5,
  },
  magnifier: {
    position: 'absolute',
    top: height * 0.1,
    width: width * 0.9,
    height: height * 0.45,
    borderRadius: width * 0.45,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  magnifiedImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  button1: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
   button2: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 100,
  },
  buttonText: {
    color: '#0033cc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  button3: {
  backgroundColor: '#fff',
  paddingHorizontal: 25,
  paddingVertical: 10,
  borderRadius: 25,
  marginBottom: 40,
},
avatarButton: {
  marginLeft: 10,
},


})
