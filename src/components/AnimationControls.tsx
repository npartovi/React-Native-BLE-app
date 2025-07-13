import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ANIMATIONS } from '../constants';
import { SectionHeader, Button } from './ui';
import { theme } from '../styles/theme';

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
  return (
    <View style={styles.animationSection}>
      <SectionHeader 
        title="LED Animations" 
        subtitle="Choose from various lighting effects"
        icon="✨"
        color={theme.colors.accent}
      />

      <View style={styles.animationButtons}>
        {ANIMATIONS.map(animation => (
          <Button
            key={animation.id}
            title={animation.name}
            onPress={() => onAnimationSelect(animation.id)}
            variant="secondary"
            size="sm"
            selected={activeAnimation === animation.id}
            style={[
              styles.animationButton,
              { backgroundColor: animation.color }
            ]}
          />
        ))}
      </View>

      <View style={styles.controlButtons}>
        <Button
          title="🔘 Solid Mode"
          onPress={onSolidMode}
          variant="primary"
          size="md"
          selected={activeAnimation === 'solid'}
          style={styles.controlButton}
        />

        {activeAnimation !== 'none' && activeAnimation !== 'solid' && (
          <Button
            title="⏹️ Stop Animation"
            onPress={onStopAnimation}
            variant="secondary"
            size="md"
            style={styles.controlButton}
          />
        )}
      </View>

      {/* Color Cycle Toggle - Only show for non-rainbow animations */}
      {activeAnimation !== 'none' && activeAnimation !== 'solid' && !['rainbow', 'pride', 'plasma'].includes(activeAnimation) && (
        <View style={styles.cycleSection}>
          <Button
            title={`🌈 Color Cycle ${colorCycleMode ? 'ON' : 'OFF'}`}
            onPress={onToggleColorCycle}
            variant="accent"
            size="md"
            selected={colorCycleMode}
            style={styles.cycleButton}
          />
          {colorCycleMode && (
            <Text style={styles.cycleInfo}>
              ⏱️ Colors change automatically every 10 seconds
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  animationSection: {
    marginVertical: theme.spacing.md,
  },
  animationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  animationButton: {
    width: '48%',
    marginBottom: theme.spacing.sm,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  controlButton: {
    flex: 1,
  },
  cycleSection: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  cycleButton: {
    marginBottom: theme.spacing.sm,
  },
  cycleInfo: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
});