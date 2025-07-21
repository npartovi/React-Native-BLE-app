import { Device, State } from 'react-native-ble-plx';

export interface ConnectedCloud {
  id: string;
  name: string;
  device: Device;
  isConnected: boolean;
  lastConnected: Date;
  // LED control state for this specific cloud
  ledState: {
    ledPower: boolean;
    selectedColor: string;
    brightness: number;
    activeAnimation: string;
    colorCycleMode: boolean;
    matrixEyeColor: string;
    matrixPupilColor: string;
    matrixHeartMode: boolean;
    matrixVisualizerMode: boolean;
    matrixHeartColor1: string;
    matrixHeartColor2: string;
    selectedPalette: number | null;
  };
}

export interface BluetoothContextType {
  bluetoothState: State;
  connectedClouds: ConnectedCloud[];
  activeCloudId: string | null;
  isScanning: boolean;
  discoveredDevices: Device[];
  scanForDevices: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectDevice: (cloudId: string) => Promise<void>;
  switchToCloud: (cloudId: string) => void;
  sendBLECommand: (command: string, cloudId?: string) => Promise<void>;
}

export interface LEDContextType {
  ledPower: boolean;
  selectedColor: string;
  brightness: number;
  activeAnimation: string;
  colorCycleMode: boolean;
  matrixEyeColor: string;
  matrixPupilColor: string;
  matrixHeartMode: boolean;
  matrixVisualizerMode: boolean;
  matrixHeartColor1: string;
  matrixHeartColor2: string;
  selectedPalette: number | null;
  toggleLED: () => Promise<void>;
  handleColorChange: (color: string) => Promise<void>;
  handleBrightnessChange: (value: number) => Promise<void>;
  handleAnimationSelect: (animationType: string) => Promise<void>;
  stopAnimation: () => Promise<void>;
  setSolidMode: () => Promise<void>;
  toggleColorCycle: () => Promise<void>;
  handleMatrixEyeColorChange: (color: string) => Promise<void>;
  handleMatrixPupilColorChange: (color: string) => Promise<void>;
  handleMatrixHeartModeToggle: () => Promise<void>;
  handleMatrixVisualizerModeToggle: () => Promise<void>;
  handleMatrixHeartColor1Change: (color: string) => Promise<void>;
  handleMatrixHeartColor2Change: (color: string) => Promise<void>;
  handlePaletteSelect: (paletteId: number) => Promise<void>;
  handlePaletteDisable: () => Promise<void>;
  handleRandomIntervalChange: (seconds: number) => Promise<void>;
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