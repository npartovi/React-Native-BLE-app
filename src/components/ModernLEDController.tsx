import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { theme } from '../styles/theme';
import { LEDContextType } from '../types';

interface ModernLEDControllerProps extends LEDContextType {
  // All props are included via LEDContextType
}

const { width, height } = Dimensions.get('window');

const MODE_OPTIONS = [
  { id: 'solid', name: 'Solid', icon: '⚪', color: '#6E6E73' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', color: '#FF3B30' },
  { id: 'gradient', name: 'Gradient', icon: '🎨', color: '#007AFF' },
  { id: 'fade', name: 'Fade', icon: '✨', color: '#FF9500' },
  { id: 'pulse', name: 'Pulse', icon: '💓', color: '#34C759' },
];

export const ModernLEDController: React.FC<ModernLEDControllerProps> = ({
  ledPower,
  selectedColor,
  brightness,
  activeAnimation,
  toggleLED,
  handleColorChange,
  handleBrightnessChange,
  handleAnimationSelect,
}) => {
  const [selectedMode, setSelectedMode] = useState('gradient');

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    handleAnimationSelect(modeId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background with blur effect simulation */}
      <View style={styles.backgroundOverlay} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Control Panel */}
        <View style={styles.controlPanel}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Electric Dreams</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            {MODE_OPTIONS.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeButton,
                  { backgroundColor: mode.color },
                  selectedMode === mode.id && styles.selectedModeButton,
                ]}
                onPress={() => handleModeSelect(mode.id)}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                {selectedMode === mode.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Mode Labels */}
          <View style={styles.modeLabels}>
            {MODE_OPTIONS.map((mode) => (
              <Text
                key={`${mode.id}-label`}
                style={[
                  styles.modeLabel,
                  selectedMode === mode.id && styles.selectedModeLabel,
                ]}
              >
                {mode.name}
              </Text>
            ))}
          </View>

          {/* LED Preview Area */}
          <View style={styles.previewArea}>
            <View style={[styles.ledPreview, { backgroundColor: selectedColor }]}>
              <View style={styles.ledStrip}>
                {[...Array(8)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.ledDot,
                      {
                        backgroundColor: ledPower ? selectedColor : '#E5E5EA',
                        opacity: ledPower ? (brightness / 255) : 0.3,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.previewLabel}>LED Strip Preview</Text>
            </View>
          </View>

          {/* Color Picker */}
          <View style={styles.colorPicker}>
            <Text style={styles.colorPickerLabel}>Color Selection</Text>
            
            {/* Color Grid */}
            <View style={styles.colorGrid}>
              {[
                '#FF0000', '#FF8000', '#FFFF00', '#80FF00',
                '#00FF00', '#00FF80', '#00FFFF', '#0080FF',
                '#0000FF', '#8000FF', '#FF00FF', '#FF0080'
              ].map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorButton,
                  ]}
                  onPress={() => handleColorChange(color)}
                >
                  {selectedColor === color && (
                    <View style={styles.colorCheckmark}>
                      <Text style={styles.colorCheckmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Color Preview */}
            <View style={styles.colorPreview}>
              <View style={[styles.selectedColorDot, { backgroundColor: selectedColor }]} />
              <Text style={styles.colorText}>{selectedColor.toUpperCase()}</Text>
            </View>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>📍</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>☀️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.powerButton, ledPower && styles.powerButtonActive]}
              onPress={toggleLED}
            >
              <Text style={[styles.powerIcon, ledPower && styles.powerIconActive]}>
                ⚡
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  controlPanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  modeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedModeButton: {
    transform: [{ scale: 1.1 }],
  },
  modeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  modeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  modeLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    width: 50,
  },
  selectedModeLabel: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  previewArea: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  ledPreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  ledStrip: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  ledDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  previewLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  colorPicker: {
    marginBottom: theme.spacing.xl,
  },
  colorPickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  colorButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColorButton: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  colorCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCheckmarkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  selectedColorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  colorText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 20,
  },
  powerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  powerIcon: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  powerIconActive: {
    color: theme.colors.textInverse,
  },
});