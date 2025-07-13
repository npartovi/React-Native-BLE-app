import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, SectionHeader, Button } from './ui';
import { COLOR_PALETTES } from '../constants';
import { theme } from '../styles/theme';

interface PaletteControlsProps {
  selectedPalette: number | null;
  onPaletteSelect: (paletteId: number) => void;
  onPaletteDisable: () => void;
}

export const PaletteControls: React.FC<PaletteControlsProps> = ({
  selectedPalette,
  onPaletteSelect,
  onPaletteDisable,
}) => {
  return (
    <Card>
      <SectionHeader 
        title="Color Palettes" 
        subtitle="Transform animations with beautiful color schemes"
        icon="🎨"
        color={theme.colors.accent}
      />

      <View style={styles.paletteGrid}>
        {COLOR_PALETTES.map(palette => (
          <View key={palette.id} style={styles.paletteItem}>
            <Button
              title={palette.name}
              onPress={() => onPaletteSelect(palette.id)}
              variant="secondary"
              size="sm"
              selected={selectedPalette === palette.id}
              style={styles.paletteButton}
            />
            
            {/* Color preview */}
            <View style={styles.colorPreview}>
              {palette.colors.map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color }
                  ]}
                />
              ))}
            </View>
            
            <Text style={styles.paletteDescription}>
              {palette.description}
            </Text>
          </View>
        ))}
      </View>

      {selectedPalette !== null && (
        <View style={styles.controlSection}>
          <Button
            title="🚫 Disable Palette"
            onPress={onPaletteDisable}
            variant="secondary"
            size="md"
            style={styles.disableButton}
          />
          <Text style={styles.tip}>
            💡 Palettes work best with plasma-style animations like Wave, Aurora, and Ocean
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  paletteItem: {
    width: '48%',
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  paletteButton: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  colorPreview: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  colorSwatch: {
    width: 20,
    height: 16,
    flex: 1,
  },
  paletteDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  controlSection: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  disableButton: {
    marginBottom: theme.spacing.md,
  },
  tip: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
});