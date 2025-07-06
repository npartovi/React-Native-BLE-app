import { useState, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { SERVICE_UUID, CHARACTERISTIC_UUID } from '../constants';

export const useBluetooth = () => {
  const [bleManager] = useState(() => {
    console.log('Creating new BleManager instance');
    return new BleManager();
  });
  const [bluetoothState, setBluetoothState] = useState<State>('Unknown');
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
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
    }, 15000);
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

  return {
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
  };
};