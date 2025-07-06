import React from 'react';
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

  return (
    <View style={styles.brightnessSection}>
      <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        Brightness: {Math.round(brightness)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={10}
        maximumValue={255}
        value={brightness}
        onValueChange={onBrightnessChange}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbStyle={styles.thumb}
      />
      <View style={styles.sliderLabels}>
        <Text style={[styles.sliderLabel, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
          Dim
        </Text>
        <Text style={[styles.sliderLabel, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
          Bright
        </Text>
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
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  thumb: {
    backgroundColor: '#1fb28a',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
  },
});