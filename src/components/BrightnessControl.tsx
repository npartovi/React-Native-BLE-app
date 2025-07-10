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
      <Text style={styles.controlLabel}>
        Brightness: {Math.round(brightness)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={10}
        maximumValue={255}
        value={brightness}
        onValueChange={onBrightnessChange}
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
