import { useState } from 'react';
import { RAINBOW_ANIMATIONS } from '../constants';

interface UseLEDControlProps {
  sendBLECommand: (command: string) => Promise<void>;
  connectedDevice: any;
}

export const useLEDControl = ({ sendBLECommand, connectedDevice }: UseLEDControlProps) => {
  const [ledPower, setLedPower] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [brightness, setBrightness] = useState(84);
  const [activeAnimation, setActiveAnimation] = useState('none');

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
        !RAINBOW_ANIMATIONS.includes(activeAnimation)
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

  const setSolidMode = async () => {
    setActiveAnimation('solid');

    if (ledPower) {
      // Stop any running animation and set to solid color
      await sendBLECommand('ANIMATION_STOP');
      
      // Apply current selected color
      const r = parseInt(selectedColor.slice(1, 3), 16);
      const g = parseInt(selectedColor.slice(3, 5), 16);
      const b = parseInt(selectedColor.slice(5, 7), 16);
      const command = `COLOR_${r}_${g}_${b}`;
      await sendBLECommand(command);
    }
  };

  // Reset LED power when device disconnects
  const resetLEDState = () => {
    setLedPower(false);
  };

  return {
    ledPower,
    selectedColor,
    brightness,
    activeAnimation,
    toggleLED,
    handleColorChange,
    handleBrightnessChange,
    handleAnimationSelect,
    stopAnimation,
    setSolidMode,
    resetLEDState,
  };
};