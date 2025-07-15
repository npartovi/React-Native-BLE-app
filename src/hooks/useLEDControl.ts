import { useState, useEffect } from 'react';
import { RAINBOW_ANIMATIONS } from '../constants';

interface UseLEDControlProps {
  sendBLECommand: (command: string) => Promise<void>;
  connectedDevice: any;
  setNotificationCallback: (callback: (message: string) => void) => void;
}

export const useLEDControl = ({ sendBLECommand, connectedDevice, setNotificationCallback }: UseLEDControlProps) => {
  const [ledPower, setLedPower] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [brightness, setBrightness] = useState(84);
  const [activeAnimation, setActiveAnimation] = useState('none');
  const [colorCycleMode, setColorCycleMode] = useState(false);
  const [matrixEyeColor, setMatrixEyeColor] = useState('GREEN');
  const [matrixPupilColor, setMatrixPupilColor] = useState('RED');
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null);

  // Handle state updates from ESP32
  useEffect(() => {
    const handleStateUpdate = (message: string) => {
      console.log('Processing state update:', message);
      
      if (message === 'STATE_LED_ON') {
        setLedPower(true);
      } else if (message === 'STATE_LED_OFF') {
        setLedPower(false);
      } else if (message.startsWith('STATE_ANIMATION_')) {
        const animationType = message.substring(16).toLowerCase(); // Remove 'STATE_ANIMATION_'
        setActiveAnimation(animationType);
      } else if (message === 'STATE_COLOR_CYCLE_ON') {
        setColorCycleMode(true);
      }
    };

    if (connectedDevice) {
      setNotificationCallback(handleStateUpdate);
    }
  }, [connectedDevice, setNotificationCallback]);

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

      // If an animation is running (except rainbow-based ones and solid mode), update animation color
      if (
        activeAnimation !== 'none' &&
        activeAnimation !== 'solid' &&
        !RAINBOW_ANIMATIONS.includes(activeAnimation)
      ) {
        const command = `ANIMATION_COLOR_${r}_${g}_${b}`;
        await sendBLECommand(command);
      } else {
        // Otherwise, set static color (for solid mode or no animation)
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
      
      // If color cycle mode is active, start it
      if (colorCycleMode) {
        await sendBLECommand('COLOR_CYCLE_ON');
      }
    }
  };

  const stopAnimation = async () => {
    setActiveAnimation('none');

    if (ledPower) {
      await sendBLECommand('ANIMATION_STOP');
    }
  };

  const setSolidMode = async () => {
    setActiveAnimation('solid');
    setColorCycleMode(false); // Disable color cycle in solid mode

    if (ledPower) {
      // Stop any running animation and color cycle
      await sendBLECommand('ANIMATION_STOP');
      await sendBLECommand('COLOR_CYCLE_OFF');
      
      // Apply current selected color
      const r = parseInt(selectedColor.slice(1, 3), 16);
      const g = parseInt(selectedColor.slice(3, 5), 16);
      const b = parseInt(selectedColor.slice(5, 7), 16);
      const command = `COLOR_${r}_${g}_${b}`;
      await sendBLECommand(command);
    }
  };

  const toggleColorCycle = async () => {
    const newCycleMode = !colorCycleMode;
    setColorCycleMode(newCycleMode);

    console.log('toggleColorCycle called:', { newCycleMode, ledPower, activeAnimation });

    if (ledPower) {
      if (newCycleMode) {
        console.log('Sending COLOR_CYCLE_ON command');
        await sendBLECommand('COLOR_CYCLE_ON');
      } else {
        console.log('Sending COLOR_CYCLE_OFF command');
        await sendBLECommand('COLOR_CYCLE_OFF');
        // Apply current selected color when turning off cycle
        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        const command = `ANIMATION_COLOR_${r}_${g}_${b}`;
        await sendBLECommand(command);
      }
    } else {
      console.log('LED power is off, not sending BLE command');
    }
  };

  const handleMatrixEyeColorChange = async (color: string) => {
    setMatrixEyeColor(color);

    if (ledPower) {
      const command = `MATRIX_EYE_${color}`;
      await sendBLECommand(command);
    }
  };

  const handleMatrixPupilColorChange = async (color: string) => {
    setMatrixPupilColor(color);

    if (ledPower) {
      const command = `MATRIX_PUPIL_${color}`;
      await sendBLECommand(command);
    }
  };

  const handlePaletteSelect = async (paletteId: number) => {
    setSelectedPalette(paletteId);

    if (ledPower) {
      const command = `PALETTE_${paletteId}`;
      await sendBLECommand(command);
    }
  };

  const handlePaletteDisable = async () => {
    setSelectedPalette(null);

    if (ledPower) {
      const command = 'PALETTE_OFF';
      await sendBLECommand(command);
    }
  };

  const handleRandomIntervalChange = async (seconds: number) => {
    if (ledPower) {
      const command = `RANDOM_INTERVAL_${seconds}`;
      await sendBLECommand(command);
    }
  };

  // Reset LED power when device disconnects
  const resetLEDState = () => {
    setLedPower(false);
    setColorCycleMode(false);
    setSelectedPalette(null);
  };

  return {
    ledPower,
    selectedColor,
    brightness,
    activeAnimation,
    colorCycleMode,
    matrixEyeColor,
    matrixPupilColor,
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
    handlePaletteSelect,
    handlePaletteDisable,
    handleRandomIntervalChange,
    resetLEDState,
  };
};