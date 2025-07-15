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
  // Determine what to show in right panel
  const showColors = activeAnimation === 'solid';
  const showRandomControls = activeAnimation === 'random';
  const nonPaletteAnimations = ['rainbow', 'pride', 'fire'];
  const showPalettes =
    !nonPaletteAnimations.includes(activeAnimation) &&
    activeAnimation !== 'solid' &&
    activeAnimation !== 'random';
  const showEmptyPalettes = nonPaletteAnimations.includes(activeAnimation);
  const showRightPanel = true; // Always show right panel
  return (
    <Card>
      <SectionHeader
        title={
          showRandomControls
            ? 'Effects & Settings'
            : showPalettes
            ? 'Effects & Palettes'
            : showColors
            ? 'Effects & Colors'
            : 'Effects & Palettes'
        }
        subtitle={
          showRandomControls
            ? 'Control random effect timing'
            : showColors
            ? 'Choose animation and color scheme'
            : showEmptyPalettes
            ? 'Choose your LED animation'
            : 'Choose animation and color scheme'
        }
        icon="✨"
        color={theme.colors.accent}
      />

      <View style={styles.mainContainer}>
        {/* Animations Column */}
        <View
          style={[styles.column, !showRightPanel && styles.fullWidthColumn]}
        >
          <Text style={styles.columnTitle}>🎬 Effects</Text>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Control Buttons */}
            {activeAnimation !== 'none' && activeAnimation !== 'solid' && (
              <View style={styles.controlButtons}>
                <Button
                  title="⏹️ Stop"
                  onPress={onStopAnimation}
                  variant="secondary"
                  size="sm"
                  style={styles.controlButton}
                />
              </View>
            )}

            {/* Solid Mode Button */}
            <Button
              title="🔘 Solid"
              onPress={onSolidMode}
              variant="primary"
              size="sm"
              selected={activeAnimation === 'solid'}
              style={styles.listButton}
            />

            {/* Animation List */}
            {ANIMATIONS.map(animation => (
              <Button
                key={animation.id}
                title={animation.name}
                onPress={() => onAnimationSelect(animation.id)}
                variant="secondary"
                size="sm"
                selected={activeAnimation === animation.id}
                style={[
                  styles.listButton,
                  { backgroundColor: animation.color },
                ]}
              />
            ))}

            {/* Color Cycle Toggle */}
            {activeAnimation !== 'none' &&
              activeAnimation !== 'solid' &&
              !['rainbow', 'pride', 'plasma'].includes(activeAnimation) && (
                <View style={styles.cycleSection}>
                  <Button
                    title={`🌈 Color Cycle ${colorCycleMode ? 'ON' : 'OFF'}`}
                    onPress={onToggleColorCycle}
                    variant="accent"
                    size="sm"
                    selected={colorCycleMode}
                    style={styles.listButton}
                  />
                  {colorCycleMode && (
                    <Text style={styles.cycleInfo}>
                      ⏱️ Auto-change every 10s
                    </Text>
                  )}
                </View>
              )}
          </ScrollView>
        </View>

        {/* Separator - Only show when right panel is visible */}
        {showRightPanel && <View style={styles.separator} />}

        {/* Right Panel - Show palettes or colors based on selection */}
        {showRightPanel && (
          <View style={styles.column}>
            <Text style={styles.columnTitle}>
              {showRandomControls
                ? '⚙️ Settings'
                : showPalettes
                ? '🎨 Palettes'
                : '🎨 Colors'}
            </Text>

            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {showRandomControls ? (
                /* Random Effect Controls */
                <View style={styles.randomControls}>
                  <Text style={styles.randomTitle}>🎲 Random Interval</Text>
                  <Text style={styles.randomDescription}>
                    Set how often random changes occur
                  </Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={randomInterval}
                      onChangeText={setRandomInterval}
                      onBlur={() => {
                        const seconds = parseInt(randomInterval) || 10;
                        const validSeconds = Math.max(
                          1,
                          Math.min(300, seconds),
                        );
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

                  <Text style={styles.randomHint}>💡 Range: 1-300 seconds</Text>

                  <View style={styles.quickButtons}>
                    <Text style={styles.quickTitle}>Quick Select:</Text>
                    {[5, 10, 15, 30, 60].map(seconds => (
                      <TouchableOpacity
                        key={seconds}
                        style={[
                          styles.quickButton,
                          randomInterval === seconds.toString() &&
                            styles.quickButtonSelected,
                        ]}
                        onPress={() => {
                          setRandomInterval(seconds.toString());
                          if (onRandomIntervalChange) {
                            onRandomIntervalChange(seconds);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.quickButtonText,
                            randomInterval === seconds.toString() &&
                              styles.quickButtonTextSelected,
                          ]}
                        >
                          {seconds}s
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : showColors ? (
                /* Color Selection for Solid Mode */
                <View style={styles.colorList}>
                  {COLOR_OPTIONS.map(colorOption => (
                    <TouchableOpacity
                      key={colorOption.color}
                      style={[
                        styles.colorItem,
                        selectedColor === colorOption.color &&
                          styles.selectedColorItem,
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
                      <Text style={styles.colorName}>{colorOption.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : showPalettes ? (
                <>
                  {/* Palette List */}
                  {COLOR_PALETTES.map(palette => (
                    <View key={palette.id} style={styles.paletteItem}>
                      <Button
                        title={palette.name}
                        onPress={() => onPaletteSelect(palette.id)}
                        variant="secondary"
                        size="sm"
                        selected={selectedPalette === palette.id}
                        style={styles.listButton}
                      />

                      {/* Color preview */}
                      <View style={styles.colorPreview}>
                        {palette.colors.map((color, index) => (
                          <View
                            key={index}
                            style={[
                              styles.colorSwatch,
                              { backgroundColor: color },
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                /* Empty State for Non-Palette Animations */
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>🌈 Built-in Colors</Text>
                  <Text style={styles.emptyStateText}>
                    This effect uses its own beautiful color scheme and doesn't
                    support custom palettes.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    height: 350, // Fixed height to prevent scrolling
    marginTop: theme.spacing.sm,
  },
  column: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  fullWidthColumn: {
    paddingHorizontal: theme.spacing.md,
  },
  columnTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  controlButtons: {
    marginBottom: theme.spacing.md,
  },
  listButton: {
    marginBottom: theme.spacing.xs,
    width: '100%',
  },
  paletteItem: {
    marginBottom: theme.spacing.md,
  },
  colorPreview: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  colorSwatch: {
    flex: 1,
    height: 12,
  },
  paletteDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontSize: 10,
  },
  cycleSection: {
    marginTop: theme.spacing.md,
  },
  cycleInfo: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontSize: 10,
    fontStyle: 'italic',
  },
  colorList: {
    marginTop: theme.spacing.sm,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  selectedColorItem: {
    backgroundColor: theme.colors.surface,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  colorName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  checkmark: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  emptyStateTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  randomControls: {
    padding: theme.spacing.md,
  },
  randomTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  randomDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
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
    marginRight: theme.spacing.sm,
    minWidth: 60,
    textAlign: 'center',
  },
  timeLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  randomHint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.lg,
  },
  quickButtons: {
    marginTop: theme.spacing.md,
  },
  quickTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  quickButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    minWidth: 50,
    alignItems: 'center',
  },
  quickButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  quickButtonText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  quickButtonTextSelected: {
    color: theme.colors.background,
  },
});
