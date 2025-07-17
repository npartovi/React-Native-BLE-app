import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { AnimationPaletteSelector } from './AnimationPaletteSelector';
import { MatrixControls } from './MatrixControls';
import { CloudPreview } from './CloudPreview';
import { Card, SectionHeader } from './ui';
import { LEDContextType } from '../types';
import { theme } from '../styles/theme';
import { Device, State } from 'react-native-ble-plx';

interface LEDControlsProps extends LEDContextType {
  bluetoothState: State | null;
  connectedDevice: Device | null;
  onDisconnect: () => void;
}

export const LEDControls: React.FC<LEDControlsProps> = ({
  ledPower,
  selectedColor,
  brightness,
  activeAnimation,
  colorCycleMode,
  matrixEyeColor,
  matrixPupilColor,
  selectedPalette,
  toggleLED,
  handleColorChange,
  handleBrightnessChange,
  handleAnimationSelect,
  stopAnimation,
  setSolidMode,
  toggleColorCycle,
  handleMatrixEyeColorChange,
  handleMatrixPupilColorChange,
  handlePaletteSelect,
  handlePaletteDisable,
  bluetoothState,
  connectedDevice,
  onDisconnect,
}) => {
  const getBluetoothIcon = () => {
    switch (bluetoothState) {
      case 'PoweredOn':
        return '📶';
      case 'PoweredOff':
        return '📵';
      default:
        return '❓';
    }
  };

  const getBluetoothStatusColor = () => {
    switch (bluetoothState) {
      case 'PoweredOn':
        return '#00ff00';
      case 'PoweredOff':
        return '#ff0000';
      default:
        return '#ffc300';
    }
  };

  const getConnectionStatusColor = () => {
    return connectedDevice ? '#00ff00' : '#ff0000';
  };
  return (
    <Card elevated style={styles.ledCard}>
      {/* Device Status Section */}
      <View style={styles.deviceStatusRow}>
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

      <View style={styles.powerBrightnessRow}>
        <Text style={styles.lightIcon}>💡</Text>
        
        <View style={styles.brightnessContainer}>
          <Text style={styles.brightnessValue}>{Math.round(brightness)}</Text>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.brightnessSlider}
              minimumValue={10}
              maximumValue={255}
              value={brightness}
              onValueChange={handleBrightnessChange}
              minimumTrackTintColor="#ffd60a"
              maximumTrackTintColor="#003566"
              thumbStyle={styles.sliderThumb}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.powerButton, ledPower && styles.powerButtonActive]}
          onPress={toggleLED}
          activeOpacity={0.8}
        >
          <Text style={styles.powerIcon}>⏻</Text>
        </TouchableOpacity>
      </View>

      {ledPower && (
        <>
          <AnimationPaletteSelector
            activeAnimation={activeAnimation}
            selectedPalette={selectedPalette}
            selectedColor={selectedColor}
            colorCycleMode={colorCycleMode}
            onAnimationSelect={handleAnimationSelect}
            onStopAnimation={stopAnimation}
            onSolidMode={setSolidMode}
            onToggleColorCycle={toggleColorCycle}
            onPaletteSelect={handlePaletteSelect}
            onPaletteDisable={handlePaletteDisable}
            onColorChange={handleColorChange}
          />

          <MatrixControls
            matrixEyeColor={matrixEyeColor}
            matrixPupilColor={matrixPupilColor}
            onMatrixEyeColorChange={handleMatrixEyeColorChange}
            onMatrixPupilColorChange={handleMatrixPupilColorChange}
          />
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  ledCard: {
    backgroundColor: '#001d3d',
    borderColor: '#ffc300',
  },
  powerBrightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0, 53, 102, 0.3)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 195, 0, 0.2)',
  },
  lightIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  brightnessContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  brightnessValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffd60a',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  sliderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  brightnessSlider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: '#ffc300',
  },
  powerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#003566',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffc300',
  },
  powerButtonActive: {
    backgroundColor: '#ffd60a',
  },
  powerIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001d3d',
  },
  controlLabel: {
    ...theme.typography.bodyBold,
    color: '#ffc300',
  },
  deviceStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0, 53, 102, 0.3)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 195, 0, 0.2)',
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