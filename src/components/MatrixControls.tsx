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
        icon="👁️"
        color={theme.colors.matrix}
      />

      <View style={styles.mainContainer}>
        {/* Eye Visualization */}
        <EyeVisualization 
          eyeColor={matrixEyeColor}
          pupilColor={matrixPupilColor}
        />

        {/* Color Selection */}
        <View style={styles.colorControls}>
          {/* Eye Color Selection */}
          <View style={styles.colorRow}>
            <Text style={styles.colorLabel}>Eye</Text>
            <View style={styles.colorOptions}>
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
          <View style={styles.colorRow}>
            <Text style={styles.colorLabel}>Pupil</Text>
            <View style={styles.colorOptions}>
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
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  eye: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  pupil: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.textInverse,
  },
  colorControls: {
    flex: 1.2,
    marginLeft: theme.spacing.md,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  colorLabel: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    width: 40,
    fontSize: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    flex: 1,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedSwatch: {
    borderColor: theme.colors.textPrimary,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
});