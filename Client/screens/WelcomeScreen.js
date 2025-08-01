import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


export default function WelcomeScreen() {
  const navigation = useNavigation();
  
  return (
    <ImageBackground
      source={require('../assest/images/welcome_img.jpg')} // ảnh nền mới
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Let's Get Started!</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              style={styles.signupButton}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    marginTop: 500,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 60,
  },
  buttonContainer: {
    gap: 16,
  },
  signupButton: {
    paddingVertical: 12,
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
  },
  signupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginPrompt: {
    fontSize: 16 ,
    color: '#fff',
    fontWeight: '600',
  },
  loginLink: {
    fontSize: 16 ,
    fontWeight: '800',
    color: '#1e3a8a',
  },
});
