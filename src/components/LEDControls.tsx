import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { BrightnessControl } from './BrightnessControl';
import { AnimationPaletteSelector } from './AnimationPaletteSelector';
import { MatrixControls } from './MatrixControls';
import { Card, SectionHeader } from './ui';
import { LEDContextType } from '../types';
import { theme } from '../styles/theme';

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
}) => {
  return (
    <Card elevated>
      <SectionHeader 
        title="LED Controls" 
        icon="💡"
        color={theme.colors.primary}
      />

      <View style={styles.controlRow}>
        <Text style={styles.controlLabel}>
          System Power
        </Text>
        <Switch
          value={ledPower}
          onValueChange={toggleLED}
          trackColor={{ 
            false: theme.colors.border, 
            true: theme.colors.primaryLight 
          }}
          thumbColor={ledPower ? theme.colors.accent : theme.colors.textMuted}
        />
      </View>

      {ledPower && (
        <>
          <BrightnessControl
            brightness={brightness}
            onBrightnessChange={handleBrightnessChange}
          />

          <AnimationPaletteSelector
            activeAnimation={activeAnimation}
            selectedPalette={selectedPalette}
            selectedColor={selectedColor}
            colorCycleMode={colorCycleMode}
            onAnimationSelect={handleAnimationSelect}
            onStopAnimation={stopAnimation}
            onSolidMode={setSolidMode}
            onToggleColorCycle={toggleColorCycle}
            onPaletteSelect={handlePaletteSelect}
            onPaletteDisable={handlePaletteDisable}
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
    </Card>
  );
};

const styles = StyleSheet.create({
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  controlLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
});