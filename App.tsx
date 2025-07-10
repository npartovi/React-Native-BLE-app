import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  Header,
  StatusCard,
  DeviceScanner,
  LEDControls,
} from './src/components';
import { useBluetooth } from './src/hooks/useBluetooth';
import { useLEDControl } from './src/hooks/useLEDControl';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView style={styles.scrollView}>
        <Header />

        {/* Bluetooth Status */}
        <StatusCard
          title="Bluetooth Status"
          statusColor={getBluetoothStatusColor()}
          statusText={bluetoothState || 'Unknown'}
        />

        {/* Connection Status */}
        <StatusCard
          title="Connection Status"
          statusColor={getConnectionStatusColor()}
          statusText={
            connectedDevice
              ? `Connected to ${connectedDevice.name || 'ESP32'}`
              : 'Not Connected'
          }
        >
          {connectedDevice && (
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={disconnectDevice}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </StatusCard>

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
            toggleLED={ledControl.toggleLED}
            handleColorChange={ledControl.handleColorChange}
            handleBrightnessChange={ledControl.handleBrightnessChange}
            handleAnimationSelect={ledControl.handleAnimationSelect}
            stopAnimation={ledControl.stopAnimation}
            setSolidMode={ledControl.setSolidMode}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
