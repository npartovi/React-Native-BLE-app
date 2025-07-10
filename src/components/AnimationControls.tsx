import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { ANIMATIONS } from '../constants';

interface AnimationControlsProps {
  activeAnimation: string;
  colorCycleMode: boolean;
  onAnimationSelect: (animationType: string) => void;
  onStopAnimation: () => void;
  onSolidMode: () => void;
  onToggleColorCycle: () => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  activeAnimation,
  colorCycleMode,
  onAnimationSelect,
  onStopAnimation,
  onSolidMode,
  onToggleColorCycle,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.animationSection}>
      <Text style={styles.controlLabel}>
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

      <View style={styles.controlButtons}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.solidButton,
            activeAnimation === 'solid' && styles.selectedControlButton,
          ]}
          onPress={onSolidMode}
        >
          <Text style={styles.buttonText}>🔘 Solid Mode</Text>
        </TouchableOpacity>

        {activeAnimation !== 'none' && activeAnimation !== 'solid' && (
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={onStopAnimation}
          >
            <Text style={styles.buttonText}>Stop Animation</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Color Cycle Toggle - Only show for non-rainbow animations */}
      {activeAnimation !== 'none' && activeAnimation !== 'solid' && !['rainbow', 'pride', 'plasma'].includes(activeAnimation) && (
        <View style={styles.cycleSection}>
          <TouchableOpacity
            style={[
              styles.cycleButton,
              colorCycleMode && styles.cycleButtonActive,
            ]}
            onPress={onToggleColorCycle}
          >
            <Text style={[styles.cycleButtonText, colorCycleMode && styles.cycleButtonTextActive]}>
              🌈 Color Cycle {colorCycleMode ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          {colorCycleMode && (
            <Text style={styles.cycleInfo}>
              Colors change every 10 seconds
            </Text>
          )}
        </View>
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
    color: '#000814',
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
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedAnimationButton: {
    borderWidth: 3,
    borderColor: '#000814',
  },
  animationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  controlButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  solidButton: {
    backgroundColor: '#003566',
  },
  stopButton: {
    backgroundColor: '#001d3d',
  },
  selectedControlButton: {
    borderWidth: 3,
    borderColor: '#000814',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cycleSection: {
    marginTop: 15,
    alignItems: 'center',
  },
  cycleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#001d3d',
    borderWidth: 2,
    borderColor: '#ffc300',
  },
  cycleButtonActive: {
    backgroundColor: '#ffc300',
  },
  cycleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffc300',
  },
  cycleButtonTextActive: {
    color: '#000814',
  },
  cycleInfo: {
    fontSize: 12,
    color: '#000814',
    marginTop: 5,
    opacity: 0.7,
  },
});