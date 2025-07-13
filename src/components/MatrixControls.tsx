import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, SectionHeader, Button } from './ui';
import { theme } from '../styles/theme';

interface MatrixControlsProps {
  matrixEyeColor: string;
  matrixPupilColor: string;
  onMatrixEyeColorChange: (color: string) => void;
  onMatrixPupilColorChange: (color: string) => void;
}

const MATRIX_COLORS = [
  { id: 'GREEN', name: '🟢 Green', color: '#4CAF50' },
  { id: 'YELLOW', name: '🟡 Yellow', color: '#FFEB3B' },
  { id: 'RED', name: '🔴 Red', color: '#F44336' },
];

export const MatrixControls: React.FC<MatrixControlsProps> = ({
  matrixEyeColor,
  matrixPupilColor,
  onMatrixEyeColorChange,
  onMatrixPupilColorChange,
}) => {
  return (
    <Card>
      <SectionHeader 
        title="8x8 Matrix Eye Animation" 
        subtitle="Control your bicolor LED matrix display"
        icon="👁️"
        color={theme.colors.matrix}
      />

      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>
          Eye Color (Primary)
        </Text>
        <View style={styles.colorButtons}>
          {MATRIX_COLORS.map(color => (
            <Button
              key={color.id}
              title={color.name}
              onPress={() => onMatrixEyeColorChange(color.id)}
              variant="matrix"
              size="sm"
              selected={matrixEyeColor === color.id}
              style={[
                styles.colorButton,
                { backgroundColor: color.color }
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>
          Pupil Color (Secondary)
        </Text>
        <Text style={styles.tip}>
          💡 Tip: Match eye and pupil colors for transparent pupil effect
        </Text>
        <View style={styles.colorButtons}>
          {MATRIX_COLORS.map(color => (
            <Button
              key={color.id}
              title={color.name}
              onPress={() => onMatrixPupilColorChange(color.id)}
              variant="matrix"
              size="sm"
              selected={matrixPupilColor === color.id}
              style={[
                styles.colorButton,
                { backgroundColor: color.color }
              ]}
            />
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  controlLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  colorSection: {
    marginBottom: theme.spacing.lg,
  },
  colorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  colorButton: {
    width: '30%',
    marginBottom: theme.spacing.sm,
  },
  tip: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
});