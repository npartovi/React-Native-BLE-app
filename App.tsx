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
  CloudManager,
} from './src/components';
import { useBluetooth } from './src/hooks/useBluetooth';
import { useLEDControl } from './src/hooks/useLEDControl';

type AppScreen = 'home' | 'controls';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');

  const {
    bluetoothState,
    connectedClouds,
    activeCloudId,
    connectedDevice, // For backward compatibility
    isScanning,
    discoveredDevices,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    switchToCloud,
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

  // Navigation handlers
  const handleGoToControls = (cloudId: string) => {
    if (cloudId !== activeCloudId) {
      switchToCloud(cloudId);
    }
    setCurrentScreen('controls');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  const handleDisconnectCloud = async (cloudId: string) => {
    await disconnectDevice(cloudId);
    // If we disconnected the active cloud and we're on controls screen, go home
    if (cloudId === activeCloudId && currentScreen === 'controls') {
      setCurrentScreen('home');
    }
  };

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

      <ScrollView 
        style={styles.scrollView}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        {currentScreen === 'home' ? (
          <>
            {/* Header */}
            <Header />

            {/* Combined Bluetooth & Connection Status */}
            <BluetoothStatusCard
              bluetoothState={bluetoothState}
              connectedDevice={connectedDevice}
              onDisconnect={() => {
                // For backward compatibility - disconnect active cloud
                if (activeCloudId) {
                  handleDisconnectCloud(activeCloudId);
                }
              }}
            />

            {/* Cloud Manager - Show connected clouds */}
            <CloudManager
              connectedClouds={connectedClouds}
              activeCloudId={activeCloudId}
              onSwitchToCloud={switchToCloud}
              onDisconnectCloud={handleDisconnectCloud}
              onControlCloud={handleGoToControls}
            />
            
            {/* Device Scanner */}
            <DeviceScanner
              isScanning={isScanning}
              discoveredDevices={discoveredDevices}
              onScan={scanForDevices}
              onConnect={connectToDevice}
            />
          </>
        ) : (
          /* LED Controls Screen */
          connectedDevice && (
          <LEDControls
            ledPower={ledControl.ledPower}
            selectedColor={ledControl.selectedColor}
            brightness={ledControl.brightness}
            activeAnimation={ledControl.activeAnimation}
            colorCycleMode={ledControl.colorCycleMode}
            matrixEyeColor={ledControl.matrixEyeColor}
            matrixPupilColor={ledControl.matrixPupilColor}
            matrixHeartMode={ledControl.matrixHeartMode}
            matrixVisualizerMode={ledControl.matrixVisualizerMode}
            matrixClockMode={ledControl.matrixClockMode}
            matrixHeartColor1={ledControl.matrixHeartColor1}
            matrixHeartColor2={ledControl.matrixHeartColor2}
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
            handleMatrixHeartModeToggle={ledControl.handleMatrixHeartModeToggle}
            handleMatrixVisualizerModeToggle={ledControl.handleMatrixVisualizerModeToggle}
            handleMatrixClockModeToggle={ledControl.handleMatrixClockModeToggle}
            handleMatrixHeartColor1Change={ledControl.handleMatrixHeartColor1Change}
            handleMatrixHeartColor2Change={ledControl.handleMatrixHeartColor2Change}
            handlePaletteSelect={ledControl.handlePaletteSelect}
            handlePaletteDisable={ledControl.handlePaletteDisable}
            handleRandomIntervalChange={ledControl.handleRandomIntervalChange}
            bluetoothState={bluetoothState}
            connectedDevice={connectedDevice}
            onDisconnect={() => {
              if (activeCloudId) {
                handleDisconnectCloud(activeCloudId);
              }
            }}
            onGoHome={handleGoHome}
          />
          )
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
    padding: theme.spacing.sm,
  },
});

export default App;
