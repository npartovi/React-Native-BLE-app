// Design system and theme constants
export const theme = {
  colors: {
    // Primary background
    background: '#0A0E1A',
    surface: '#1A1F2E',
    surfaceElevated: '#242938',
    
    // Primary colors
    primary: '#6366F1', // Modern indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // Accent colors
    accent: '#F59E0B', // Warm amber
    accentLight: '#FCD34D',
    accentDark: '#D97706',
    
    // Matrix theme
    matrix: '#10B981', // Emerald green for matrix section
    matrixLight: '#34D399',
    matrixDark: '#059669',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Text colors
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    textInverse: '#1F2937',
    
    // Border and divider
    border: '#374151',
    borderLight: '#4B5563',
    divider: '#2D3748',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
  },
};

export type Theme = typeof theme;