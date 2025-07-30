import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
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
      <TouchableOpacity
        style={[
          styles.scanButton,
          { backgroundColor: isScanning ? '#ffc300' : '#ffd60a' },
        ]}
        onPress={onScan}
        disabled={isScanning}
      >
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : 'Scan for Electric Dream Devices'}
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
              <Text style={styles.deviceName}>
                {device.name || 'Unknown Electric Dream Device'}
              </Text>
              <Text style={styles.deviceId}>{device.id}</Text>
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc300',
    backgroundColor: '#003566',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffd60a',
  },
  scanButton: {
    padding: 12,
    borderRadius: 8,
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
    borderColor: '#ffc300',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#001d3d',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd60a',
  },
  deviceId: {
    fontSize: 12,
    marginTop: 2,
    color: '#ffffff',
    opacity: 0.8,
  },
});
