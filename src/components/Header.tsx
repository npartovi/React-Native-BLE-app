import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export const Header: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        ESP32 LED Controller
      </Text>
      <Text style={[styles.subtitle, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
        Bluetooth Low Energy
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
});