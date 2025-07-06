import React from 'react';
import { View, Text, Switch, StyleSheet, useColorScheme } from 'react-native';
import { BrightnessControl } from './BrightnessControl';
import { AnimationControls } from './AnimationControls';
import { ColorControls } from './ColorControls';
import { LEDContextType } from '../types';

interface LEDControlsProps extends LEDContextType {
  // All props are included via LEDContextType
}

export const LEDControls: React.FC<LEDControlsProps> = ({
  ledPower,
  selectedColor,
  brightness,
  activeAnimation,
  toggleLED,
  handleColorChange,
  handleBrightnessChange,
  handleAnimationSelect,
  stopAnimation,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
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
          <BrightnessControl
            brightness={brightness}
            onBrightnessChange={handleBrightnessChange}
          />

          <AnimationControls
            activeAnimation={activeAnimation}
            onAnimationSelect={handleAnimationSelect}
            onStopAnimation={stopAnimation}
          />

          <ColorControls
            selectedColor={selectedColor}
            activeAnimation={activeAnimation}
            onColorChange={handleColorChange}
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
});