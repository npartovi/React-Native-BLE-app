import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { ANIMATIONS } from '../constants';

interface AnimationControlsProps {
  activeAnimation: string;
  onAnimationSelect: (animationType: string) => void;
  onStopAnimation: () => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  activeAnimation,
  onAnimationSelect,
  onStopAnimation,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.animationSection}>
      <Text style={[styles.controlLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        LED Animations
      </Text>

      <View style={styles.animationButtons}>
        {ANIMATIONS.map(animation => (
          <TouchableOpacity
            key={animation.id}
            style={[
              styles.animationButton,
              { backgroundColor: animation.color },
              activeAnimation === animation.id &&
                styles.selectedAnimationButton,
            ]}
            onPress={() => onAnimationSelect(animation.id)}
          >
            <Text style={styles.animationButtonText}>
              {animation.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeAnimation !== 'none' && (
        <TouchableOpacity
          style={styles.stopButton}
          onPress={onStopAnimation}
        >
          <Text style={styles.buttonText}>Stop Animation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  animationSection: {
    marginVertical: 15,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  animationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  animationButton: {
    width: '48%',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedAnimationButton: {
    borderWidth: 3,
    borderColor: '#333',
  },
  animationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});