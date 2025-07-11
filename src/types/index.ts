import { Device, State } from 'react-native-ble-plx';

export interface BluetoothContextType {
  bluetoothState: State;
  connectedDevice: Device | null;
  isScanning: boolean;
  discoveredDevices: Device[];
  scanForDevices: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  sendBLECommand: (command: string) => Promise<void>;
}

export interface LEDContextType {
  ledPower: boolean;
  selectedColor: string;
  brightness: number;
  activeAnimation: string;
  colorCycleMode: boolean;
  matrixEyeColor: string;
  matrixPupilColor: string;
  toggleLED: () => Promise<void>;
  handleColorChange: (color: string) => Promise<void>;
  handleBrightnessChange: (value: number) => Promise<void>;
  handleAnimationSelect: (animationType: string) => Promise<void>;
  stopAnimation: () => Promise<void>;
  setSolidMode: () => Promise<void>;
  toggleColorCycle: () => Promise<void>;
  handleMatrixEyeColorChange: (color: string) => Promise<void>;
  handleMatrixPupilColorChange: (color: string) => Promise<void>;
}

export interface Animation {
  id: string;
  name: string;
  color: string;
}

export interface ColorOption {
  color: string;
  name: string;
}