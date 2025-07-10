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
    getBluetoothStatusColor,
    getConnectionStatusColor,
  } = useBluetooth();

  const ledControl = useLEDControl({
    sendBLECommand,
    connectedDevice,
  });

  // Reset LED state when device disconnects
  useEffect(() => {
    if (!connectedDevice) {
      ledControl.resetLEDState();
    }
  }, [connectedDevice]);

  const backgroundStyle = {
    backgroundColor: '#000814',
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
            toggleLED={ledControl.toggleLED}
            handleColorChange={ledControl.handleColorChange}
            handleBrightnessChange={ledControl.handleBrightnessChange}
            handleAnimationSelect={ledControl.handleAnimationSelect}
            stopAnimation={ledControl.stopAnimation}
            setSolidMode={ledControl.setSolidMode}
            toggleColorCycle={ledControl.toggleColorCycle}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814',
  },
  scrollView: {
    padding: 16,
  },
});

export default App;
