// src/screens/AiConsultScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { callGptWithImage } from '../utils/gptApi';

export default function AiConsultScreen() {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result?.assets?.length > 0) {
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleConsult = async () => {
    const promptToSend = customPrompt.trim() || selectedPrompt;
    if (!promptToSend) return Alert.alert('Lỗi', 'Vui lòng nhập câu hỏi.');

    try {
      setLoading(true);
      setResponse(null);

      const reply = await callGptWithImage(promptToSend, imageBase64);
      setResponse(reply);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Tư Vấn Thiết Kế</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
        <Text style={styles.uploadButtonText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>
      {imageBase64 && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
          style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 20 }}
          resizeMode="cover"
        />
      )}

      <Text style={styles.label}>Chọn câu hỏi mẫu:</Text>
      {promptSamples.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.promptButton,
            selectedPrompt === item && styles.selectedPrompt,
          ]}
          onPress={() => {
            setSelectedPrompt(item);
            setCustomPrompt('');
          }}
        >
          <Text style={styles.promptText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Hoặc nhập câu hỏi tùy ý:</Text>
      <TextInput
        style={styles.input}
        value={customPrompt}
        onChangeText={(text) => {
          setCustomPrompt(text);
          setSelectedPrompt('');
        }}
        placeholder="Nhập câu hỏi của bạn..."
        multiline
      />

      <TouchableOpacity
        style={styles.consultButton}
        onPress={handleConsult}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.consultButtonText}>Tư Vấn</Text>
        )}
      </TouchableOpacity>

      {response && (
        <View style={styles.responseBox}>
          <Text style={styles.responseTitle}>Phản hồi từ AI:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}

// promptSamples giữ nguyên như cũ
const promptSamples = [
  'Tôi nên chọn màu sơn nào cho phòng ngủ nhỏ?',
  'Gợi ý mẫu gạch lát nền cho phòng khách hiện đại.',
  'Tôi muốn thiết kế lại phòng bếp theo phong cách tối giản.',
  'Tôi nên phối màu như thế nào cho không gian rộng?',
  'Những xu hướng nội thất năm nay là gì?',
];

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f7fa', // nền xám nhạt hiện đại
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f3b73',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 10,
  },
  promptButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedPrompt: {
    borderColor: '#0d6efd',
    backgroundColor: '#e6f0ff',
  },
  promptText: {
    fontSize: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  consultButton: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  consultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  responseBox: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d6e4f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  responseTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    color: '#1f3b73',
  },
  responseText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
});
