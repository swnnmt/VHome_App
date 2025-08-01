import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const TopupModal = ({ visible, onClose, onSelect }) => {
  const packages = [
    {
      id: 'basic',
      name: 'BASIC',
      price: '20.000VND',
      storage: '2 lượt',
      features: ['2 lượt thiết kế', 'Màu sơn đa dạng', 'Mẫu gạch phong phú'],
      color: '#f6a623',
    },
    {
      id: 'standard',
      name: 'STANDARD',
      price: '50.000VND',
      storage: '10 lượt',
      features: ['10 lượt thiết kế', 'AI tư vấn', 'Màu sơn, mẫu gạch đa dạng'],
      color: '#2196f3',
    },
    {
      id: 'pro',
      name: 'PREMIUM',
      price: '99.000VND',
      storage: 'Không giới hạn 1 tháng',
      features: ['Không giới hạn lượt thiết kế 1 tháng', 'AI tư vấn', 'Màu sơn, mẫu gạch đa dạng'],
      color: '#0d47a1',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Chọn gói nạp</Text>
          <View style={styles.packageRow}>
            {packages.map(pkg => (
              <TouchableOpacity
                key={pkg.id}
                style={[styles.packageBox, { backgroundColor: pkg.color }]}
                onPress={() => onSelect(pkg)}
              >
                <Text style={styles.packageTitle}>{pkg.name}</Text>
                <Text style={styles.packagePrice}>{pkg.price}</Text>
                {pkg.features.map((f, index) => (
                  <Text key={index} style={styles.featureItem}>✓ {f}</Text>
                ))}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TopupModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '97%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  packageBox: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  packageTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  packagePrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packageStorage: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 12,
  },
  featureItem: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 2,
  },
  cancelText: {
    marginTop: 20,
    color: '#555',
    fontSize: 14,
  },
});
