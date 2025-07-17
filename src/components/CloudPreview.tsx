import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card } from './ui';
import { theme } from '../styles/theme';

export const CloudPreview: React.FC = () => {
  return (
    <Card style={styles.previewCard}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/cloud.png')}
          style={styles.cloudImage}
          resizeMode="contain"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: '#001d3d',
    borderColor: '#ffc300',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudImage: {
    width: '100%',
    height: '100%',
  },
});