import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Electric Dreams</Text>
      <Text style={styles.subtitle}>LED Controller</Text>
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
    color: '#ffd60a',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffc300',
    opacity: 0.9,
  },
});
