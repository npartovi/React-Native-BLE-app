import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SectionHeader } from './ui';
import { theme } from '../styles/theme';

interface MatrixControlsProps {
  matrixEyeColor: string;
  matrixPupilColor: string;
  matrixHeartMode: boolean;
  matrixHeartColor1: string;
  matrixHeartColor2: string;
  onMatrixEyeColorChange: (color: string) => void;
  onMatrixPupilColorChange: (color: string) => void;
  onMatrixHeartModeToggle: () => void;
  onMatrixHeartColor1Change: (color: string) => void;
  onMatrixHeartColor2Change: (color: string) => void;
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
  matrixHeartMode,
  matrixHeartColor1,
  matrixHeartColor2,
  onMatrixEyeColorChange,
  onMatrixPupilColorChange,
  onMatrixHeartModeToggle,
  onMatrixHeartColor1Change,
  onMatrixHeartColor2Change,
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader 
        title="Matrix Eyes" 
        icon="👁️"
        color={theme.colors.matrix}
      />

      {/* Animation Mode Toggle */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeToggleButton,
            !matrixHeartMode && styles.activeModeButton
          ]}
          onPress={() => matrixHeartMode && onMatrixHeartModeToggle()}
        >
          <Text style={styles.modeToggleIcon}>👁️</Text>
          <Text style={[
            styles.modeToggleText,
            !matrixHeartMode && styles.activeModeText
          ]}>Eyes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeToggleButton,
            matrixHeartMode && styles.activeModeButton
          ]}
          onPress={() => !matrixHeartMode && onMatrixHeartModeToggle()}
        >
          <Text style={styles.modeToggleIcon}>💖</Text>
          <Text style={[
            styles.modeToggleText,
            matrixHeartMode && styles.activeModeText
          ]}>Hearts</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {/* Eye Visualization */}
        <EyeVisualization 
          eyeColor={matrixEyeColor}
          pupilColor={matrixPupilColor}
        />

        {/* Color Selection */}
        <View style={styles.colorControls}>
          {!matrixHeartMode ? (
            <>
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
            </>
          ) : (
            <>
              {/* Heart Color 1 Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Fill</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixHeartColor1 === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixHeartColor1Change(color.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Heart Color 2 Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Edge</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixHeartColor2 === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixHeartColor2Change(color.id)}
                    />
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  activeModeButton: {
    backgroundColor: theme.colors.primary,
  },
  modeToggleIcon: {
    fontSize: 16,
  },
  modeToggleText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeModeText: {
    color: theme.colors.textInverse,
  },
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