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
        return '#00ff00'; // Green for powered on
      case 'PoweredOff':
        return '#ff0000'; // Red for powered off
      default:
        return '#ffc300'; // Golden yellow for unknown
    }
  };

  const getConnectionStatusColor = () => {
    return connectedDevice ? '#00ff00' : '#ff0000'; // Green for connected, red for disconnected
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Status</Text>
      </View>
      
      <View style={styles.statusRow}>
        {/* Bluetooth Status */}
        <View style={styles.statusItem}>
          <Text style={styles.statusIcon}>{getBluetoothIcon()}</Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getBluetoothStatusColor() },
            ]}
          />
          <Text style={styles.statusLabel}>BT</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.statusItem}>
          <Text style={styles.statusIcon}>🔗</Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getConnectionStatusColor() },
            ]}
          />
          <Text style={styles.statusLabel}>
            {connectedDevice ? 'ESP32' : 'Off'}
          </Text>
        </View>

        {/* Disconnect Button */}
        {connectedDevice && (
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={onDisconnect}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffc300',
    backgroundColor: '#001d3d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd60a',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 53, 102, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    flex: 0.3,
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '500',
  },
  disconnectButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    flex: 0.35,
    alignItems: 'center',
  },
  disconnectText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});