import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  StatusBar,
  useColorScheme,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { BleManager, Device, State } from 'react-native-ble-plx';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [bleManager] = useState(() => {
    console.log('Creating new BleManager instance');
    return new BleManager();
  });
  const [bluetoothState, setBluetoothState] = useState<State>('Unknown');
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [ledPower, setLedPower] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [brightness, setBrightness] = useState(84); // Default brightness (0-255)
  const [activeAnimation, setActiveAnimation] = useState('none'); // Current animation mode
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Check if BLE is supported first
    bleManager
      .state()
      .then(state => {
        console.log('Initial BLE state:', state);
        setBluetoothState(state);
      })
      .catch(error => {
        console.log('BLE state error:', error);
        Alert.alert(
          'BLE Error',
          'Bluetooth Low Energy is not supported on this device',
        );
      });

    const subscription = bleManager.onStateChange(state => {
      console.log('BLE state changed to:', state);
      setBluetoothState(state);
      if (state === 'PoweredOn') {
        requestPermissions();
      }
    }, true);

    return () => {
      subscription.remove();
      bleManager.destroy();
    };
  }, [bleManager]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (!allGranted) {
        Alert.alert(
          'Permissions required',
          'Please grant all permissions to use Bluetooth features',
        );
      }
    }
  };

  const scanForDevices = () => {
    console.log('Scan requested, current state:', bluetoothState);

    // Force check the current state before scanning
    bleManager
      .state()
      .then(currentState => {
        console.log('Current BLE state check:', currentState);
        setBluetoothState(currentState);

        if (currentState !== 'PoweredOn') {
          Alert.alert(
            'Bluetooth Issue',
            `Bluetooth state: ${currentState}. Please ensure Bluetooth is enabled in Settings.`,
            [
              { text: 'Check State Again', onPress: () => scanForDevices() },
              { text: 'OK' },
            ],
          );
          return;
        }

        // Proceed with scan if powered on
        performScan();
      })
      .catch(error => {
        console.log('Error checking BLE state:', error);
        Alert.alert(
          'BLE Error',
          'Cannot check Bluetooth state. Try restarting the app.',
        );
      });
  };

  const performScan = () => {
    console.log('Starting BLE scan...');
    setIsScanning(true);
    setDiscoveredDevices([]);

    // Scan for both advertising devices and connected devices
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.log('Scan error:', error);
          setIsScanning(false);
          Alert.alert('Scan Error', `Failed to scan: ${error.message}`);
          return;
        }

        if (device) {
          console.log(
            'Found device:',
            device.name || device.localName || 'Unknown',
            device.id,
          );

          // Look for ESP32 devices or devices with our service
          if (
            device.name?.includes('ESP32') ||
            device.localName?.includes('ESP32') ||
            device.serviceUUIDs?.includes(SERVICE_UUID)
          ) {
            console.log(
              'ESP32 device found:',
              device.name || device.localName,
              device.id,
            );
            setDiscoveredDevices(prevDevices => {
              if (!prevDevices.find(d => d.id === device.id)) {
                return [...prevDevices, device];
              }
              return prevDevices;
            });
          }
        }
      },
    );

    // Also check for already connected devices
    bleManager
      .connectedDevices([])
      .then(connectedDevices => {
        console.log(
          'All connected devices:',
          connectedDevices.map(d => ({ name: d.name, id: d.id })),
        );
        connectedDevices.forEach(device => {
          if (
            device.name?.includes('ESP32') ||
            device.localName?.includes('ESP32')
          ) {
            console.log('Adding connected ESP32 device:', device.name);
            setDiscoveredDevices(prevDevices => {
              if (!prevDevices.find(d => d.id === device.id)) {
                return [...prevDevices, device];
              }
              return prevDevices;
            });
          }
        });
      })
      .catch(error => {
        console.log('Error getting connected devices:', error);
      });

    setTimeout(() => {
      console.log('Scan timeout - stopping scan');
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 15000); // Increased timeout to 15 seconds
  };

  const connectToDevice = async (device: Device) => {
    try {
      bleManager.stopDeviceScan();
      setIsScanning(false);

      const connectedDevice = await device.connect();
      setConnectedDevice(connectedDevice);

      await connectedDevice.discoverAllServicesAndCharacteristics();

      Alert.alert('Success', `Connected to ${device.name || 'ESP32 Device'}`);
    } catch (error) {
      console.log('Connection error:', error);
      Alert.alert('Connection Failed', 'Could not connect to device');
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setLedPower(false);
        Alert.alert('Disconnected', 'Device disconnected successfully');
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    }
  };

  const sendBLECommand = async (command: string) => {
    if (!connectedDevice) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      // Convert string to base64 without using Buffer (React Native compatible)
      const base64Command = btoa(command);
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command,
      );
      console.log('Sent command:', command);
    } catch (error) {
      console.log('Send command error:', error);
      Alert.alert('Error', 'Failed to send command to device');
    }
  };

  const toggleLED = async () => {
    const newPowerState = !ledPower;
    const command = newPowerState ? 'LED_ON' : 'LED_OFF';

    await sendBLECommand(command);
    setLedPower(newPowerState);
  };

  const handleColorChange = async (color: string) => {
    setSelectedColor(color);

    if (ledPower) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // If an animation is running (except rainbow-based ones), update animation color
      if (
        activeAnimation !== 'none' &&
        activeAnimation !== 'rainbow' &&
        activeAnimation !== 'pride'
      ) {
        const command = `ANIMATION_COLOR_${r}_${g}_${b}`;
        await sendBLECommand(command);
      } else {
        // Otherwise, set static color
        const command = `COLOR_${r}_${g}_${b}`;
        await sendBLECommand(command);
      }
    }
  };

  const handleBrightnessChange = async (value: number) => {
    setBrightness(value);

    if (ledPower) {
      const brightnessValue = Math.round(value);
      const command = `BRIGHTNESS_${brightnessValue}`;
      await sendBLECommand(command);
    }
  };

  const handleAnimationSelect = async (animationType: string) => {
    setActiveAnimation(animationType);

    if (ledPower) {
      const command = `ANIMATION_${animationType.toUpperCase()}`;
      await sendBLECommand(command);
    }
  };

  const stopAnimation = async () => {
    setActiveAnimation('none');

    if (ledPower) {
      await sendBLECommand('ANIMATION_STOP');
    }
  };

  const getBluetoothStatusColor = () => {
    switch (bluetoothState) {
      case 'PoweredOn':
        return '#4CAF50';
      case 'PoweredOff':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getConnectionStatusColor = () => {
    return connectedDevice ? '#4CAF50' : '#F44336';
  };

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            ESP32 LED Controller
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
            Bluetooth Low Energy
          </Text>
        </View>

        {/* Bluetooth Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Bluetooth Status
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getBluetoothStatusColor() },
              ]}
            />
            <Text style={[styles.statusText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              {bluetoothState}
            </Text>
          </View>
        </View>

        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Connection Status
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getConnectionStatusColor() },
              ]}
            />
            <Text style={[styles.statusText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              {connectedDevice
                ? `Connected to ${connectedDevice.name || 'ESP32'}`
                : 'Not Connected'}
            </Text>
          </View>
          {connectedDevice && (
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={disconnectDevice}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Device Scanning */}
        {!connectedDevice && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              ESP32 Devices
            </Text>
            <TouchableOpacity
              style={[
                styles.scanButton,
                { backgroundColor: isScanning ? '#FF9800' : '#2196F3' },
              ]}
              onPress={scanForDevices}
              disabled={isScanning}
            >
              <Text style={styles.buttonText}>
                {isScanning ? 'Scanning...' : 'Scan for ESP32 Devices'}
              </Text>
            </TouchableOpacity>

            {discoveredDevices.length > 0 && (
              <View style={styles.devicesContainer}>
                {discoveredDevices.map(device => (
                  <TouchableOpacity
                    key={device.id}
                    style={styles.deviceItem}
                    onPress={() => connectToDevice(device)}
                  >
                    <Text style={[styles.deviceName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                      {device.name || 'Unknown ESP32'}
                    </Text>
                    <Text style={[styles.deviceId, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                      {device.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* LED Controls - Only show when connected */}
        {connectedDevice && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              LED Controls
            </Text>

            <View style={styles.controlRow}>
              <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                LED Power
              </Text>
              <Switch
                value={ledPower}
                onValueChange={toggleLED}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={ledPower ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>

            {ledPower && (
              <>
                <View style={styles.brightnessSection}>
                  <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    Brightness: {Math.round(brightness)}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={255}
                    value={brightness}
                    onValueChange={handleBrightnessChange}
                    minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbStyle={styles.thumb}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={[styles.sliderLabel, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                      Dim
                    </Text>
                    <Text style={[styles.sliderLabel, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                      Bright
                    </Text>
                  </View>
                </View>

                <View style={styles.animationSection}>
                  <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    LED Animations
                  </Text>

                  <View style={styles.animationButtons}>
                    {[
                      { id: 'rainbow', name: '🌈 Rainbow', color: '#FF6B6B' },
                      {
                        id: 'pride',
                        name: '🌀 Rolling Rainbow Balls',
                        color: '#FF1493',
                      },
                      { id: 'fade', name: '✨ Fade', color: '#4ECDC4' },
                      { id: 'strobe', name: '⚡ Strobe', color: '#45B7D1' },
                      { id: 'wave', name: '🌊 Wave', color: '#96CEB4' },
                      { id: 'sparkle', name: '💫 Sparkle', color: '#FFEAA7' },
                      { id: 'breathe', name: '💨 Breathe', color: '#DDA0DD' },
                    ].map(animation => (
                      <TouchableOpacity
                        key={animation.id}
                        style={[
                          styles.animationButton,
                          { backgroundColor: animation.color },
                          activeAnimation === animation.id &&
                            styles.selectedAnimationButton,
                        ]}
                        onPress={() => handleAnimationSelect(animation.id)}
                      >
                        <Text style={styles.animationButtonText}>
                          {animation.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {activeAnimation !== 'none' && (
                    <TouchableOpacity
                      style={styles.stopButton}
                      onPress={stopAnimation}
                    >
                      <Text style={styles.buttonText}>Stop Animation</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Color Controls - Disabled during rainbow animations */}
                {activeAnimation !== 'rainbow' && activeAnimation !== 'pride' && (
                  <View style={styles.colorSection}>
                    <Text
                      style={[
                        styles.controlLabel,
                        { color: isDarkMode ? '#FFFFFF' : '#000000' },
                      ]}
                    >
                      {activeAnimation !== 'none' && activeAnimation !== 'rainbow' && activeAnimation !== 'pride'
                        ? 'Animation Colors'
                        : 'LED Colors'}
                    </Text>
                    {activeAnimation !== 'none' &&
                      activeAnimation !== 'rainbow' &&
                      activeAnimation !== 'pride' && (
                        <Text
                          style={[
                            styles.colorHint,
                            { color: isDarkMode ? '#aaa' : '#888' },
                          ]}
                        >
                          Selected color will be used for the animation
                        </Text>
                      )}

                    <View style={styles.colorGrid}>
                      {[
                        { color: '#FF0000', name: 'Red' },
                        { color: '#00FF00', name: 'Green' },
                        { color: '#0000FF', name: 'Blue' },
                        { color: '#FFFF00', name: 'Yellow' },
                        { color: '#FF00FF', name: 'Magenta' },
                        { color: '#00FFFF', name: 'Cyan' },
                        { color: '#FFFFFF', name: 'White' },
                        { color: '#FF8000', name: 'Orange' },
                      ].map(item => (
                        <TouchableOpacity
                          key={item.color}
                          style={[
                            styles.colorButton,
                            { backgroundColor: item.color },
                            selectedColor === item.color &&
                              styles.selectedColorButton,
                          ]}
                          onPress={() => handleColorChange(item.color)}
                        >
                          <Text style={styles.colorButtonText}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Current Color Preview */}
                    <View
                      style={[
                        styles.colorPreview,
                        { backgroundColor: selectedColor },
                      ]}
                    />
                  </View>
                )}

                {/* Rainbow Animation Info */}
                {(activeAnimation === 'rainbow' || activeAnimation === 'pride') && (
                  <View style={styles.colorSection}>
                    <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                      🌈 Rainbow Mode Active
                    </Text>
                    <Text style={[styles.rainbowInfo, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                      Color selection is disabled during rainbow animations. 
                      The animation uses its own beautiful rainbow colors!
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
  },
  scanButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
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
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 12,
    marginTop: 2,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  brightnessSection: {
    marginVertical: 15,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  thumb: {
    backgroundColor: '#1fb28a',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
  },
  animationSection: {
    marginVertical: 15,
  },
  animationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  animationButton: {
    width: '48%',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedAnimationButton: {
    borderWidth: 3,
    borderColor: '#333',
  },
  animationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorSection: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorHint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  colorButton: {
    width: '23%',
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderColor: '#333',
    borderWidth: 3,
  },
  colorButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  colorPreview: {
    height: 40,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  rainbowInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default App;