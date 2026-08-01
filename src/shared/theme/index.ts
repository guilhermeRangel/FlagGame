export const colors = {
  background: '#081225',
  surface: '#13213A',
  surfacePressed: '#1A2D4E',
  primary: '#4FD1C5',
  primaryPressed: '#38B2AC',
  textPrimary: '#FFFFFF',
  textOnPrimary: '#081225',
  textSecondary: '#B7C2D6',
  disabled: '#667085',
  success: '#34D399',
  successSurface: '#123A2A',
  danger: '#EF4444',
  dangerSurface: '#3A1824',
  border: '#263A5B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const animationDurations = {
  fast: 180,
  normal: 260,
  slow: 420,
} as const;

export const maxRotationSpeed = 4 as const;
