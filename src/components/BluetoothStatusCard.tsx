import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Device, State } from 'react-native-ble-plx';

interface BluetoothStatusCardProps {
  bluetoothState: State | null;
  connectedDevice: Device | null;
  onDisconnect: () => void;
}

export const BluetoothStatusCard: React.FC<BluetoothStatusCardProps> = ({
  bluetoothState,
  connectedDevice,
  onDisconnect,
}) => {
  const getBluetoothIcon = () => {
    switch (bluetoothState) {
      case 'PoweredOn':
        return '📶'; // Strong signal icon
      case 'PoweredOff':
        return '📵'; // No signal icon
      default:
        return '❓'; // Question mark for unknown states
    }
  };

  const getBluetoothStatusColor = () => {
    switch (bluetoothState) {
      case 'PoweredOn':
        return '#ffd60a'; // Bright yellow for powered on
      case 'PoweredOff':
        return '#003566'; // Dark blue for powered off
      default:
        return '#ffc300'; // Golden yellow for unknown
    }
  };

  const getConnectionStatusColor = () => {
    return connectedDevice ? '#ffd60a' : '#003566';
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        📱 Device Status
      </Text>
      
      {/* Bluetooth Status */}
      <View style={styles.statusRow}>
        <Text style={styles.statusIcon}>{getBluetoothIcon()}</Text>
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>Bluetooth</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getBluetoothStatusColor() },
              ]}
            />
            <Text style={styles.statusText}>
              {bluetoothState || 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      {/* Connection Status */}
      <View style={styles.statusRow}>
        <Text style={styles.statusIcon}>🔗</Text>
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>Connection</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getConnectionStatusColor() },
              ]}
            />
            <Text style={styles.statusText}>
              {connectedDevice
                ? `Connected to ${connectedDevice.name || 'ESP32'}`
                : 'Not Connected'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Disconnect Button */}
      {connectedDevice && (
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={onDisconnect}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
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
    backgroundColor: '#001d3d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#ffd60a',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 30,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffc300',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  disconnectButton: {
    backgroundColor: '#003566',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});