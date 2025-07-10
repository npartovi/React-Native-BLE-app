import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { COLOR_OPTIONS, RAINBOW_ANIMATIONS } from '../constants';

interface ColorControlsProps {
  selectedColor: string;
  activeAnimation: string;
  onColorChange: (color: string) => void;
}

export const ColorControls: React.FC<ColorControlsProps> = ({
  selectedColor,
  activeAnimation,
  onColorChange,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const isRainbowMode = RAINBOW_ANIMATIONS.includes(activeAnimation);

  if (isRainbowMode) {
    return (
      <View style={styles.colorSection}>
        <Text style={styles.controlLabel}>
          🌈 Rainbow Mode Active
        </Text>
        <Text style={styles.rainbowInfo}>
          Color selection is disabled during rainbow animations. 
          The animation uses its own beautiful rainbow colors!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.colorSection}>
      <Text style={styles.controlLabel}>
        {activeAnimation !== 'none' ? 'Animation Colors' : 'LED Colors'}
      </Text>
      {activeAnimation !== 'none' && (
        <Text style={styles.colorHint}>
          Selected color will be used for the animation
        </Text>
      )}

      <View style={styles.colorGrid}>
        {COLOR_OPTIONS.map(item => (
          <TouchableOpacity
            key={item.color}
            style={[
              styles.colorButton,
              { backgroundColor: item.color },
              selectedColor === item.color &&
                styles.selectedColorButton,
            ]}
            onPress={() => onColorChange(item.color)}
          >
            <Text style={styles.colorButtonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Color Preview */}
      <View
        style={[
          styles.colorPreview,
          { backgroundColor: selectedColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  colorSection: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc300',
    backgroundColor: '#ffd60a',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000814',
  },
  colorHint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#000814',
    opacity: 0.7,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  colorButton: {
    width: '23%',
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000814',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderColor: '#003566',
    borderWidth: 3,
  },
  colorButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  colorPreview: {
    height: 40,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#000814',
  },
  rainbowInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    color: '#000814',
    opacity: 0.8,
  },
});