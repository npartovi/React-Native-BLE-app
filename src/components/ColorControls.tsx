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
        <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          🌈 Rainbow Mode Active
        </Text>
        <Text style={[styles.rainbowInfo, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
          Color selection is disabled during rainbow animations. 
          The animation uses its own beautiful rainbow colors!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.colorSection}>
      <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        {activeAnimation !== 'none' ? 'Animation Colors' : 'LED Colors'}
      </Text>
      {activeAnimation !== 'none' && (
        <Text style={[styles.colorHint, { color: isDarkMode ? '#aaa' : '#888' }]}>
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorHint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
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
    borderColor: '#ddd',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderColor: '#333',
    borderWidth: 3,
  },
  colorButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  colorPreview: {
    height: 40,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  rainbowInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});