import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { SERVICE_UUID, CHARACTERISTIC_UUID } from '../constants';
import { ConnectedCloud } from '../types';

export const useBluetooth = () => {
  const [bleManager] = useState(() => {
    console.log('Creating new BleManager instance');
    return new BleManager();
  });
  const [bluetoothState, setBluetoothState] = useState<State | null>(null);
  const [connectedClouds, setConnectedClouds] = useState<ConnectedCloud[]>([]);
  const [activeCloudId, setActiveCloudId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const stateUpdateCallbackRef = useRef<((message: string) => void) | null>(null);

  // Helper to get default LED state for new clouds
  const getDefaultLEDState = () => ({
    ledPower: false,
    selectedColor: '#FF0000',
    brightness: 84,
    activeAnimation: 'none',
    colorCycleMode: false,
    matrixEyeColor: 'GREEN',
    matrixPupilColor: 'RED',
    matrixHeartMode: false,
    matrixVisualizerMode: false,
    matrixHeartColor1: 'RED',
    matrixHeartColor2: 'YELLOW',
    selectedPalette: null,
  });

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

          // Look for Electric Dream devices or devices with our service
          if (
            device.name?.includes('Electric Dream') ||
            device.localName?.includes('Electric Dream') ||
            device.serviceUUIDs?.includes(SERVICE_UUID)
          ) {
            console.log(
              'Electric Dream device found:',
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
    }, 15000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      bleManager.stopDeviceScan();
      setIsScanning(false);

      // Check if device is already connected
      const existingCloud = connectedClouds.find(cloud => cloud.device.id === device.id);
      if (existingCloud) {
        setActiveCloudId(existingCloud.id);
        Alert.alert('Already Connected', `Switched to ${existingCloud.name}`);
        return;
      }

      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // Create new cloud entry
      const cloudName = device.name || device.localName || `Cloud ${connectedClouds.length + 1}`;
      const newCloud: ConnectedCloud = {
        id: device.id,
        name: cloudName,
        device: connectedDevice,
        isConnected: true,
        lastConnected: new Date(),
        ledState: getDefaultLEDState(),
      };

      // Set up notification listener for this specific cloud
      console.log(`Setting up notification listener for ${cloudName}...`);
      connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log('Notification error:', error);
            return;
          }

          if (characteristic?.value) {
            const message = atob(characteristic.value);
            console.log(`Received BLE notification from ${cloudName}:`, message);
            
            // Only process notifications if this is the active cloud
            if (activeCloudId === device.id && stateUpdateCallbackRef.current) {
              console.log('Calling state update callback with:', message);
              stateUpdateCallbackRef.current(message);
            }
          }
        }
      );

      // Add cloud to connected clouds and set as active
      setConnectedClouds(prev => [...prev, newCloud]);
      setActiveCloudId(device.id);

      // Request current state after setting up notifications
      setTimeout(async () => {
        try {
          console.log(`Requesting current state from ${cloudName}...`);
          const base64Command = btoa('GET_STATE');
          await connectedDevice.writeCharacteristicWithoutResponseForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            base64Command,
          );
        } catch (error) {
          console.log('Error requesting state:', error);
        }
      }, 1000);

      Alert.alert('Success', `Connected to ${cloudName}`);
    } catch (error) {
      console.log('Connection error:', error);
      Alert.alert('Connection Failed', 'Could not connect to device');
    }
  };

  const disconnectDevice = async (cloudId: string) => {
    const cloud = connectedClouds.find(c => c.id === cloudId);
    if (cloud) {
      try {
        await cloud.device.cancelConnection();
        
        // Remove from connected clouds
        setConnectedClouds(prev => prev.filter(c => c.id !== cloudId));
        
        // If this was the active cloud, switch to another or set to null
        if (activeCloudId === cloudId) {
          const remainingClouds = connectedClouds.filter(c => c.id !== cloudId);
          setActiveCloudId(remainingClouds.length > 0 ? remainingClouds[0].id : null);
        }
        
        Alert.alert('Disconnected', `${cloud.name} disconnected successfully`);
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    }
  };

  const switchToCloud = (cloudId: string) => {
    const cloud = connectedClouds.find(c => c.id === cloudId);
    if (cloud && cloud.isConnected) {
      setActiveCloudId(cloudId);
      console.log(`Switched to cloud: ${cloud.name}`);
    }
  };

  const sendBLECommand = async (command: string, cloudId?: string) => {
    const targetCloudId = cloudId || activeCloudId;
    const cloud = connectedClouds.find(c => c.id === targetCloudId);
    
    if (!cloud) {
      Alert.alert('Error', 'No cloud connected');
      return;
    }

    try {
      const base64Command = btoa(command);
      await cloud.device.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command,
      );
      console.log(`Sent command to ${cloud.name}:`, command);
    } catch (error) {
      console.log('Send command error:', error);
      Alert.alert('Error', `Failed to send command to ${cloud.name}`);
    }
  };

  const getBluetoothStatusColor = () => {
    switch (bluetoothState) {
      case 'PoweredOn':
        return '#4CAF50';
      case 'PoweredOff':
        return '#F44336';
      case null:
        return '#FF9800';
      default:
        return '#FF9800';
    }
  };

  const setNotificationCallback = useCallback((callback: (message: string) => void) => {
    stateUpdateCallbackRef.current = callback;
  }, []);

  // Get active cloud for backward compatibility
  const activeCloud = connectedClouds.find(c => c.id === activeCloudId);
  const connectedDevice = activeCloud?.device || null;

  const getConnectionStatusColor = () => {
    if (connectedClouds.length === 0) {
      return '#F44336'; // Red for no connections
    }
    return '#4CAF50'; // Green for connected
  };

  return {
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
  };
};
