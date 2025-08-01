import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Config from 'react-native-config';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();
  const API_URL = Config.API_URL;

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}:8000/send-code`, { email });
      const otpCode = res.data.code;

      navigation.navigate('VerifyCodeScreen', {
        name,
        email,
        password,
        actualCode: otpCode,
      });
    } catch (error) {
      console.error('Lỗi gửi mã:', error);
      Alert.alert('Lỗi', 'Không thể gửi mã xác thực.');
    }
  };

  return (
    <ImageBackground
      source={require('../assest/images/bg_signup.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                {/* Icon back nếu cần */}
              </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.form}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, { marginBottom: 28 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter Password"
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
                  <Text style={styles.submitText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomTextRow}>
                <Text style={styles.bottomText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 16,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  bottomContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 48,
  },
  form: {
    marginBottom: 16,
  },
  label: {
    color: '#4B5563',
    marginLeft: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    borderRadius: 24,
    marginBottom: 12,
  },
  submitButton: {
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  bottomTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  bottomText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  loginLink: {
    fontWeight: '600',
    color: '#3B82F6',
  },
});
