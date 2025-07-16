import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

interface ColorPreviewProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showHex?: boolean;
  showName?: boolean;
  name?: string;
  style?: any;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({
  color,
  size = 'md',
  showHex = true,
  showName = false,
  name,
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return { preview: 16, text: 12 };
      case 'lg':
        return { preview: 48, text: 16 };
      default:
        return { preview: 32, text: 14 };
    }
  };

  const sizes = getSize();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.colorBox,
          {
            width: sizes.preview,
            height: sizes.preview,
            backgroundColor: color,
          },
        ]}
      />
      {(showHex || showName) && (
        <View style={styles.textContainer}>
          {showHex && (
            <Text style={[styles.hexText, { fontSize: sizes.text }]}>
              {color.toUpperCase()}
            </Text>
          )}
          {showName && name && (
            <Text style={[styles.nameText, { fontSize: sizes.text }]}>
              {name}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  colorBox: {
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  textContainer: {
    flex: 1,
  },
  hexText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  nameText: {
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
});
