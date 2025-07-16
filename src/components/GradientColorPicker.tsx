import React, { useState } from 'react';
import {
  View,
  Text,
  PanGestureHandler,
  State,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { theme } from '../styles/theme';

interface GradientColorPickerProps {
  onColorChange: (color: string) => void;
  selectedColor?: string;
}

const { width } = Dimensions.get('window');
const PICKER_WIDTH = width - 80; // Account for padding
const PICKER_HEIGHT = 40;

export const GradientColorPicker: React.FC<GradientColorPickerProps> = ({
  onColorChange,
  selectedColor = '#FF0000',
}) => {
  const [pickerPosition, setPickerPosition] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Color spectrum for the main gradient
  const colorSpectrum = [
    '#FF0000', // Red
    '#FF8000', // Orange
    '#FFFF00', // Yellow
    '#80FF00', // Yellow-Green
    '#00FF00', // Green
    '#00FF80', // Green-Cyan
    '#00FFFF', // Cyan
    '#0080FF', // Cyan-Blue
    '#0000FF', // Blue
    '#8000FF', // Blue-Magenta
    '#FF00FF', // Magenta
    '#FF0080', // Magenta-Red
  ];

  const interpolateColor = (position: number) => {
    const normalizedPosition = Math.max(0, Math.min(1, position / PICKER_WIDTH));
    const index = normalizedPosition * (colorSpectrum.length - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const ratio = index - lowerIndex;

    if (lowerIndex === upperIndex) {
      return colorSpectrum[lowerIndex];
    }

    const lowerColor = colorSpectrum[lowerIndex];
    const upperColor = colorSpectrum[upperIndex];

    // Simple RGB interpolation
    const lowerRGB = hexToRgb(lowerColor);
    const upperRGB = hexToRgb(upperColor);

    const r = Math.round(lowerRGB.r + (upperRGB.r - lowerRGB.r) * ratio);
    const g = Math.round(lowerRGB.g + (upperRGB.g - lowerRGB.g) * ratio);
    const b = Math.round(lowerRGB.b + (upperRGB.b - lowerRGB.b) * ratio);

    return rgbToHex(r, g, b);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newX = Math.max(0, Math.min(PICKER_WIDTH - 20, context.startX + event.translationX));
      translateX.value = newX;
      
      runOnJS(setPickerPosition)(newX);
      runOnJS(onColorChange)(runOnJS(interpolateColor)(newX));
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Color Selection</Text>
      
      {/* Main Color Gradient */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={colorSpectrum}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
        
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.picker, animatedStyle]}>
            <View style={styles.pickerIndicator} />
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* Brightness/Saturation Gradient */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={['#000000', 'rgba(0,0,0,0)', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
        
        <View style={[styles.picker, { left: PICKER_WIDTH / 2 - 10 }]}>
          <View style={styles.pickerIndicator} />
        </View>
      </View>

      {/* Selected Color Preview */}
      <View style={styles.colorPreview}>
        <View style={[styles.selectedColor, { backgroundColor: selectedColor }]} />
        <Text style={styles.colorText}>{selectedColor.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  gradientContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
    height: PICKER_HEIGHT,
  },
  gradient: {
    width: PICKER_WIDTH,
    height: PICKER_HEIGHT,
    borderRadius: PICKER_HEIGHT / 2,
    alignSelf: 'center',
  },
  picker: {
    position: 'absolute',
    top: -5,
    width: 20,
    height: PICKER_HEIGHT + 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  selectedColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  colorText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
});