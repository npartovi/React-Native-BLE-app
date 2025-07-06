import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Device } from 'react-native-ble-plx';

interface DeviceScannerProps {
  isScanning: boolean;
  discoveredDevices: Device[];
  onScan: () => void;
  onConnect: (device: Device) => void;
}

export const DeviceScanner: React.FC<DeviceScannerProps> = ({
  isScanning,
  discoveredDevices,
  onScan,
  onConnect,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        ESP32 Devices
      </Text>
      <TouchableOpacity
        style={[
          styles.scanButton,
          { backgroundColor: isScanning ? '#FF9800' : '#2196F3' },
        ]}
        onPress={onScan}
        disabled={isScanning}
      >
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : 'Scan for ESP32 Devices'}
        </Text>
      </TouchableOpacity>

      {discoveredDevices.length > 0 && (
        <View style={styles.devicesContainer}>
          {discoveredDevices.map(device => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceItem}
              onPress={() => onConnect(device)}
            >
              <Text style={[styles.deviceName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                {device.name || 'Unknown ESP32'}
              </Text>
              <Text style={[styles.deviceId, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                {device.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scanButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesContainer: {
    marginTop: 10,
  },
  deviceItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 12,
    marginTop: 2,
  },
});