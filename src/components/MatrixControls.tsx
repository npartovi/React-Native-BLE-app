import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, SectionHeader } from './ui';
import { theme } from '../styles/theme';

interface MatrixControlsProps {
  matrixEyeColor: string;
  matrixPupilColor: string;
  onMatrixEyeColorChange: (color: string) => void;
  onMatrixPupilColorChange: (color: string) => void;
}

const MATRIX_COLORS = [
  { id: 'GREEN', color: theme.colors.success },
  { id: 'YELLOW', color: theme.colors.warning },
  { id: 'RED', color: theme.colors.error },
];

const EyeVisualization: React.FC<{
  eyeColor: string;
  pupilColor: string;
}> = ({ eyeColor, pupilColor }) => {
  const getActualColor = (colorId: string) => {
    const colorMap = {
      'GREEN': theme.colors.success,
      'YELLOW': theme.colors.warning,
      'RED': theme.colors.error,
    };
    return colorMap[colorId] || theme.colors.success;
  };

  const actualEyeColor = getActualColor(eyeColor);
  const actualPupilColor = getActualColor(pupilColor);
  const isPupilTransparent = eyeColor === pupilColor;

  return (
    <View style={styles.eyeContainer}>
      <View style={[styles.eye, { backgroundColor: actualEyeColor }]}>
        {!isPupilTransparent && (
          <View style={[styles.pupil, { backgroundColor: actualPupilColor }]} />
        )}
      </View>
      <View style={[styles.eye, { backgroundColor: actualEyeColor }]}>
        {!isPupilTransparent && (
          <View style={[styles.pupil, { backgroundColor: actualPupilColor }]} />
        )}
      </View>
    </View>
  );
};

export const MatrixControls: React.FC<MatrixControlsProps> = ({
  matrixEyeColor,
  matrixPupilColor,
  onMatrixEyeColorChange,
  onMatrixPupilColorChange,
}) => {
  return (
    <Card>
      <SectionHeader 
        title="Matrix Eyes" 
        subtitle="Control your LED matrix display"
        icon="👁️"
        color={theme.colors.matrix}
      />

      {/* Eye Visualization */}
      <EyeVisualization 
        eyeColor={matrixEyeColor}
        pupilColor={matrixPupilColor}
      />

      {/* Eye Color Selection */}
      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>Eye Color</Text>
        <View style={styles.colorSwatches}>
          {MATRIX_COLORS.map(color => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorSwatch,
                { backgroundColor: color.color },
                matrixEyeColor === color.id && styles.selectedSwatch,
              ]}
              onPress={() => onMatrixEyeColorChange(color.id)}
            />
          ))}
        </View>
      </View>

      {/* Pupil Color Selection */}
      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>Pupil Color</Text>
        <View style={styles.colorSwatches}>
          {MATRIX_COLORS.map(color => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorSwatch,
                { backgroundColor: color.color },
                matrixPupilColor === color.id && styles.selectedSwatch,
              ]}
              onPress={() => onMatrixPupilColorChange(color.id)}
            />
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  eyeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  eye: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  pupil: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.textInverse,
  },
  colorSection: {
    marginBottom: theme.spacing.lg,
  },
  controlLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  colorSwatches: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedSwatch: {
    borderColor: theme.colors.textPrimary,
    borderWidth: 4,
    transform: [{ scale: 1.1 }],
    ...theme.shadows.lg,
  },
});