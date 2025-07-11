import React from 'react';
import { View, Text, Switch, StyleSheet, useColorScheme } from 'react-native';
import { BrightnessControl } from './BrightnessControl';
import { AnimationControls } from './AnimationControls';
import { ColorControls } from './ColorControls';
import { MatrixControls } from './MatrixControls';
import { LEDContextType } from '../types';

interface LEDControlsProps extends LEDContextType {
  // All props are included via LEDContextType
}

export const LEDControls: React.FC<LEDControlsProps> = ({
  ledPower,
  selectedColor,
  brightness,
  activeAnimation,
  colorCycleMode,
  matrixEyeColor,
  matrixPupilColor,
  toggleLED,
  handleColorChange,
  handleBrightnessChange,
  handleAnimationSelect,
  stopAnimation,
  setSolidMode,
  toggleColorCycle,
  handleMatrixEyeColorChange,
  handleMatrixPupilColorChange,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        LED Controls
      </Text>

      <View style={styles.controlRow}>
        <Text style={styles.controlLabel}>
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
          <BrightnessControl
            brightness={brightness}
            onBrightnessChange={handleBrightnessChange}
          />

          <AnimationControls
            activeAnimation={activeAnimation}
            colorCycleMode={colorCycleMode}
            onAnimationSelect={handleAnimationSelect}
            onStopAnimation={stopAnimation}
            onSolidMode={setSolidMode}
            onToggleColorCycle={toggleColorCycle}
          />

          <ColorControls
            selectedColor={selectedColor}
            activeAnimation={activeAnimation}
            onColorChange={handleColorChange}
          />

          <MatrixControls
            matrixEyeColor={matrixEyeColor}
            matrixPupilColor={matrixPupilColor}
            onMatrixEyeColorChange={handleMatrixEyeColorChange}
            onMatrixPupilColorChange={handleMatrixPupilColorChange}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc300',
    backgroundColor: '#ffc300',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000814',
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
    color: '#000814',
  },
});