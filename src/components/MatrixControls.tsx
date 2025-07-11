import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        8x8 Matrix Eye Animation
      </Text>

      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>
          Eye Color (Primary)
        </Text>
        <View style={styles.colorButtons}>
          {MATRIX_COLORS.map(color => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorButton,
                { backgroundColor: color.color },
                matrixEyeColor === color.id && styles.selectedColorButton,
              ]}
              onPress={() => onMatrixEyeColorChange(color.id)}
            >
              <Text style={styles.colorButtonText}>
                {color.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>
          Pupil Color (Secondary)
        </Text>
        <View style={styles.colorButtons}>
          {MATRIX_COLORS.map(color => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorButton,
                { backgroundColor: color.color },
                matrixPupilColor === color.id && styles.selectedColorButton,
              ]}
              onPress={() => onMatrixPupilColorChange(color.id)}
            >
              <Text style={styles.colorButtonText}>
                {color.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b35',
    backgroundColor: '#ff6b35',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000814',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000814',
  },
  colorSection: {
    marginTop: 10,
  },
  colorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  colorButton: {
    width: '30%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: '#000814',
  },
  colorButtonText: {
    color: '#000814',
    fontSize: 14,
    fontWeight: 'bold',
  },
});