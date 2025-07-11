import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Slider from '@react-native-community/slider';

interface BrightnessControlProps {
  brightness: number;
  onBrightnessChange: (value: number) => void;
}

export const BrightnessControl: React.FC<BrightnessControlProps> = ({
  brightness,
  onBrightnessChange,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [localBrightness, setLocalBrightness] = useState(brightness);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalBrightness(brightness);
  }, [brightness]);

  const handleValueChange = (value: number) => {
    setLocalBrightness(value);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout to send command after user stops dragging
    timeoutRef.current = setTimeout(() => {
      onBrightnessChange(value);
    }, 150); // 150ms delay after user stops moving slider
  };

  const handleSlidingComplete = (value: number) => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Send final value immediately when user releases slider
    onBrightnessChange(value);
  };

  return (
    <View style={styles.brightnessSection}>
      <Text style={styles.controlLabel}>
        Brightness: {Math.round(localBrightness)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={10}
        maximumValue={255}
        value={localBrightness}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#003566"
        maximumTrackTintColor="#001d3d"
        thumbStyle={styles.thumb}
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>Dim</Text>
        <Text style={styles.sliderLabel}>Bright</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  brightnessSection: {
    marginVertical: 15,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000814',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  thumb: {
    backgroundColor: '#003566',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#000814',
    opacity: 0.7,
  },
});
