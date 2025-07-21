import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { AnimationPaletteSelector } from './AnimationPaletteSelector';
import { MatrixControls } from './MatrixControls';
import { CloudPreview } from './CloudPreview';
import { SectionHeader } from './ui';
import { LEDContextType } from '../types';
import { theme } from '../styles/theme';
import { Device, State } from 'react-native-ble-plx';

interface LEDControlsProps extends LEDContextType {
  bluetoothState: State | null;
  connectedDevice: Device | null;
  onDisconnect: () => void;
  onGoHome?: () => void;
}

export const LEDControls: React.FC<LEDControlsProps> = ({
  ledPower,
  selectedColor,
  brightness,
  activeAnimation,
  colorCycleMode,
  matrixEyeColor,
  matrixPupilColor,
  matrixHeartMode,
  matrixVisualizerMode,
  matrixHeartColor1,
  matrixHeartColor2,
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
  handleMatrixHeartModeToggle,
  handleMatrixVisualizerModeToggle,
  handleMatrixHeartColor1Change,
  handleMatrixHeartColor2Change,
  handlePaletteSelect,
  handlePaletteDisable,
  bluetoothState,
  connectedDevice,
  onDisconnect,
  onGoHome,
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
    <View style={styles.container}>
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

        {/* Action Buttons */}
        {connectedDevice && (
          <View style={styles.actionButtons}>
            {onGoHome && (
              <TouchableOpacity
                style={styles.homeButton}
                onPress={onGoHome}
              >
                <Text style={styles.homeText}>🏠 Home</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={onDisconnect}
            >
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
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
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
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
            matrixHeartMode={matrixHeartMode}
            matrixVisualizerMode={matrixVisualizerMode}
            matrixHeartColor1={matrixHeartColor1}
            matrixHeartColor2={matrixHeartColor2}
            onMatrixEyeColorChange={handleMatrixEyeColorChange}
            onMatrixPupilColorChange={handleMatrixPupilColorChange}
            onMatrixHeartModeToggle={handleMatrixHeartModeToggle}
            onMatrixVisualizerModeToggle={handleMatrixVisualizerModeToggle}
            onMatrixHeartColor1Change={handleMatrixHeartColor1Change}
            onMatrixHeartColor2Change={handleMatrixHeartColor2Change}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  powerBrightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
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
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  sliderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  brightnessSlider: {
    width: '100%',
    height: 20,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  powerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  powerButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  powerIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  controlLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  deviceStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    flex: 0.5,
  },
  homeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  homeText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: '600',
  },
  disconnectButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  disconnectText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: '600',
  },
});