import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { ConnectedCloud } from '../types';
import { theme } from '../styles/theme';

interface ScanModalProps {
  visible: boolean;
  isScanning: boolean;
  discoveredDevices: Device[];
  connectedClouds: ConnectedCloud[];
  onClose: () => void;
  onConnect: (device: Device) => void;
  onStartScan: () => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({
  visible,
  isScanning,
  discoveredDevices,
  connectedClouds,
  onClose,
  onConnect,
  onStartScan,
}) => {
  // Filter out already connected devices
  const availableDevices = discoveredDevices.filter(
    device => !connectedClouds.some(cloud => cloud.id === device.id)
  );

  // Start scanning when modal opens
  useEffect(() => {
    if (visible && !isScanning && availableDevices.length === 0) {
      onStartScan();
    }
  }, [visible]);

  const handleConnect = (device: Device) => {
    onConnect(device);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Scan for Devices</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

            {/* Content */}
            <View style={styles.content}>
              {isScanning ? (
                <View style={styles.scanningContainer}>
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.scanningText}>
                    Scanning for Electric Dream devices...
                  </Text>
                </View>
              ) : availableDevices.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No devices found
                  </Text>
                  <TouchableOpacity
                    style={styles.rescanButton}
                    onPress={onStartScan}
                  >
                    <Text style={styles.rescanButtonText}>Scan Again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView
                  style={styles.deviceList}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.subtitle}>
                    Select a device to connect:
                  </Text>
                  {availableDevices.map(device => (
                    <TouchableOpacity
                      key={device.id}
                      style={styles.deviceItem}
                      onPress={() => handleConnect(device)}
                    >
                      <View style={styles.deviceInfo}>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unknown Electric Dream Device'}
                        </Text>
                        <Text style={styles.deviceId}>{device.id}</Text>
                      </View>
                      <Text style={styles.connectText}>Connect</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

          {/* Footer */}
          {!isScanning && availableDevices.length > 0 && (
            <TouchableOpacity
              style={styles.footerButton}
              onPress={onStartScan}
            >
              <Text style={styles.footerButtonText}>Rescan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  scanningText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  rescanButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  rescanButtonText: {
    ...theme.typography.button,
    color: theme.colors.textInverse,
    fontWeight: '600',
  },
  deviceList: {
    flex: 1,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  deviceInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  deviceName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  deviceId: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  connectText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footerButton: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  footerButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});