import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { theme } from './src/styles/theme';
import {
  Header,
  BluetoothStatusCard,
  DeviceScanner,
  LEDControls,
  LaunchScreen,
} from './src/components';
import { useBluetooth } from './src/hooks/useBluetooth';
import { useLEDControl } from './src/hooks/useLEDControl';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  const {
    bluetoothState,
    connectedDevice,
    isScanning,
    discoveredDevices,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    sendBLECommand,
    setNotificationCallback,
    getBluetoothStatusColor,
    getConnectionStatusColor,
  } = useBluetooth();

  const ledControl = useLEDControl({
    sendBLECommand,
    connectedDevice,
    setNotificationCallback,
  });

  // Reset LED state when device disconnects
  useEffect(() => {
    if (!connectedDevice) {
      ledControl.resetLEDState();
    }
  }, [connectedDevice]);

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  if (showLaunchScreen) {
    return (
      <LaunchScreen onComplete={() => setShowLaunchScreen(false)} />
    );
  }

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView style={styles.scrollView}>
        <Header />

        {/* Combined Bluetooth & Connection Status */}
        <BluetoothStatusCard
          bluetoothState={bluetoothState}
          connectedDevice={connectedDevice}
          onDisconnect={disconnectDevice}
        />

        {/* Device Scanner - Only show when not connected */}
        {!connectedDevice && (
          <DeviceScanner
            isScanning={isScanning}
            discoveredDevices={discoveredDevices}
            onScan={scanForDevices}
            onConnect={connectToDevice}
          />
        )}

        {/* LED Controls - Only show when connected */}
        {connectedDevice && (
          <LEDControls
            ledPower={ledControl.ledPower}
            selectedColor={ledControl.selectedColor}
            brightness={ledControl.brightness}
            activeAnimation={ledControl.activeAnimation}
            colorCycleMode={ledControl.colorCycleMode}
            matrixEyeColor={ledControl.matrixEyeColor}
            matrixPupilColor={ledControl.matrixPupilColor}
            selectedPalette={ledControl.selectedPalette}
            toggleLED={ledControl.toggleLED}
            handleColorChange={ledControl.handleColorChange}
            handleBrightnessChange={ledControl.handleBrightnessChange}
            handleAnimationSelect={ledControl.handleAnimationSelect}
            stopAnimation={ledControl.stopAnimation}
            setSolidMode={ledControl.setSolidMode}
            toggleColorCycle={ledControl.toggleColorCycle}
            handleMatrixEyeColorChange={ledControl.handleMatrixEyeColorChange}
            handleMatrixPupilColorChange={ledControl.handleMatrixPupilColorChange}
            handlePaletteSelect={ledControl.handlePaletteSelect}
            handlePaletteDisable={ledControl.handlePaletteDisable}
            handleRandomIntervalChange={ledControl.handleRandomIntervalChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    padding: theme.spacing.md,
  },
});

export default App;
