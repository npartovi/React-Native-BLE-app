import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { ANIMATIONS, COLOR_PALETTES, COLOR_OPTIONS } from '../constants';
import { Card, SectionHeader, Button } from './ui';
import { CloudPreview } from './CloudPreview';
import { theme } from '../styles/theme';

interface AnimationPaletteSelectorProps {
  activeAnimation: string;
  selectedPalette: number | null;
  selectedColor: string;
  colorCycleMode: boolean;
  onAnimationSelect: (animationType: string) => void;
  onStopAnimation: () => void;
  onSolidMode: () => void;
  onToggleColorCycle: () => void;
  onPaletteSelect: (paletteId: number) => void;
  onPaletteDisable: () => void;
  onColorChange: (color: string) => void;
  onRandomIntervalChange?: (seconds: number) => void;
}

export const AnimationPaletteSelector: React.FC<
  AnimationPaletteSelectorProps
> = ({
  activeAnimation,
  selectedPalette,
  selectedColor,
  colorCycleMode,
  onAnimationSelect,
  onStopAnimation,
  onSolidMode,
  onToggleColorCycle,
  onPaletteSelect,
  onPaletteDisable,
  onColorChange,
  onRandomIntervalChange,
}) => {
  const [randomInterval, setRandomInterval] = useState('10');
  
  // Determine what to show
  const showColors = activeAnimation === 'solid';
  const showRandomControls = activeAnimation === 'random';
  const nonPaletteAnimations = ['rainbow', 'pride', 'fire'];
  const showPalettes =
    !nonPaletteAnimations.includes(activeAnimation) &&
    activeAnimation !== 'solid' &&
    activeAnimation !== 'random';

  return (
    <Card>
      <SectionHeader
        title="LED Effects & Colors"
        subtitle="Control your LED animations and colors"
        icon="✨"
        color={theme.colors.accent}
      />

      {/* Effects Horizontal List - Above Cloud */}
      <View style={styles.effectsSection}>
        <Text style={styles.sectionTitle}>🎬 Effects</Text>
        <ScrollView
          horizontal
          style={styles.horizontalScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {/* Stop Button */}
          {activeAnimation !== 'none' && activeAnimation !== 'solid' && (
            <View style={styles.effectContainer}>
              <TouchableOpacity
                style={[styles.effectButton, styles.stopButton]}
                onPress={onStopAnimation}
              >
                <Text style={styles.effectIcon}>⏹️</Text>
              </TouchableOpacity>
              <Text style={styles.effectLabel}>Stop</Text>
            </View>
          )}

          {/* Solid Mode Button */}
          <View style={styles.effectContainer}>
            <TouchableOpacity
              style={[
                styles.effectButton,
                activeAnimation === 'solid' && styles.selectedEffect,
              ]}
              onPress={onSolidMode}
            >
              <Text style={styles.effectIcon}>🔘</Text>
            </TouchableOpacity>
            <Text style={styles.effectLabel}>Solid</Text>
          </View>

          {/* Animation Buttons */}
          {ANIMATIONS.map(animation => {
            const iconMatch = animation.name.match(/^([^\s]+) /);
            const icon = iconMatch ? iconMatch[1] : '✨';
            const label = animation.name.replace(/^[^\s]+ /, '');
            
            return (
              <View key={animation.id} style={styles.effectContainer}>
                <TouchableOpacity
                  style={[
                    styles.effectButton,
                    { backgroundColor: animation.color },
                    activeAnimation === animation.id && styles.selectedEffect,
                  ]}
                  onPress={() => onAnimationSelect(animation.id)}
                >
                  <Text style={styles.effectIcon}>{icon}</Text>
                </TouchableOpacity>
                <Text style={styles.effectLabel}>{label}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Cloud Preview */}
      <CloudPreview />

      {/* Palettes/Colors Horizontal List - Below Cloud */}
      <View style={styles.palettesSection}>
        <Text style={styles.sectionTitle}>
          {showRandomControls
            ? '⚙️ Settings'
            : showColors
            ? '🎨 Colors'
            : '🎨 Palettes'}
        </Text>
        
        {showRandomControls ? (
          /* Random Controls */
          <View style={styles.randomControls}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Interval:</Text>
              <TextInput
                style={styles.timeInput}
                value={randomInterval}
                onChangeText={setRandomInterval}
                onBlur={() => {
                  const seconds = parseInt(randomInterval) || 10;
                  const validSeconds = Math.max(1, Math.min(300, seconds));
                  setRandomInterval(validSeconds.toString());
                  if (onRandomIntervalChange) {
                    onRandomIntervalChange(validSeconds);
                  }
                }}
                keyboardType="numeric"
                placeholder="10"
                maxLength={3}
              />
              <Text style={styles.timeLabel}>seconds</Text>
            </View>
          </View>
        ) : showColors ? (
          /* Colors Horizontal List */
          <ScrollView
            horizontal
            style={styles.horizontalScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
          >
            {COLOR_OPTIONS.map(colorOption => (
              <TouchableOpacity
                key={colorOption.color}
                style={[
                  styles.colorButton,
                  selectedColor === colorOption.color && styles.selectedColor,
                ]}
                onPress={() => onColorChange(colorOption.color)}
              >
                <View
                  style={[
                    styles.colorCircle,
                    { backgroundColor: colorOption.color },
                  ]}
                >
                  {selectedColor === colorOption.color && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.colorLabel}>{colorOption.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : showPalettes ? (
          /* Palettes Horizontal List */
          <ScrollView
            horizontal
            style={styles.horizontalScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
          >
            {COLOR_PALETTES.map(palette => (
              <TouchableOpacity
                key={palette.id}
                style={[
                  styles.paletteButton,
                  selectedPalette === palette.id && styles.selectedPalette,
                ]}
                onPress={() => onPaletteSelect(palette.id)}
              >
                <View style={styles.paletteCircle}>
                  {palette.colors.map((color, index) => {
                    const stripeWidth = 50 / palette.colors.length;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.paletteStripe,
                          {
                            backgroundColor: color,
                            width: stripeWidth,
                            left: index * stripeWidth,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              This effect uses built-in colors
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  effectsSection: {
    marginBottom: theme.spacing.md,
  },
  palettesSection: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  horizontalContent: {
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  
  // Effect Buttons
  effectContainer: {
    alignItems: 'center',
  },
  effectButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 50, // Make circular
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  selectedEffect: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  effectIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  effectLabel: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    maxWidth: 70,
  },
  
  // Color Buttons
  colorButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 60,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedColor: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  colorLabel: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontSize: 10,
  },
  checkmark: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Palette Buttons
  paletteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedPalette: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  paletteCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  paletteStripe: {
    position: 'absolute',
    height: 50,
    top: 0,
  },
  
  // Random Controls
  randomControls: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  timeInput: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minWidth: 60,
    textAlign: 'center',
  },
  timeLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
