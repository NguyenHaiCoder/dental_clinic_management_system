// Design System for Dental Clinic Management System
// Modern, clean, and user-friendly UI for Vietnamese clinic staff

export const colors = {
  // Primary Colors
  primary: '#2F80ED', // Medical Blue - trust, professionalism, cleanliness
  primaryLight: '#5A9FFF',
  primaryDark: '#1E5FA8',
  secondary: '#6FCF97', // Mint / Light Teal - friendly and calming
  
  // Neutral Colors
  background: '#F7F9FC', // Light Gray / Off-white
  cardBackground: '#FFFFFF', // White
  textPrimary: '#333333', // Dark Gray
  textSecondary: '#666666', // Medium Gray
  textTertiary: '#999999', // Light Gray
  
  // Status Colors
  success: '#27AE60',
  successLight: '#6FCF97',
  warning: '#F2994A',
  warningLight: '#FFB84D',
  error: '#EB5757',
  errorLight: '#FF6B6B',
  info: '#2D9CDB',
  infoLight: '#56CCF2',
  
  // Additional
  border: '#E0E0E0',
  divider: '#F0F0F0',
  disabled: '#CCCCCC',
  disabledText: '#999999',
  hover: '#F5F5F5',
  
  // Table specific
  tableHeader: '#F8F9FA',
  tableRowEven: '#FFFFFF',
  tableRowOdd: '#FAFBFC',
};

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 28,
  },
  lineHeight: {
    tight: 1.4,
    normal: 1.5,
    relaxed: 1.6,
  },
  // Title sizes for desktop/mobile
  title: {
    desktop: 22,
    mobile: 24,
  },
  body: {
    desktop: 16,
    mobile: 14,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const transitions = {
  fast: 150,
  normal: 200,
  slow: 250,
};

// Responsive breakpoints
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

// Touch target minimum size (accessibility)
export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
};

// Layout constants
export const layout = {
  sidebarWidth: 240,
  headerHeight: 64,
  tabBarHeight: 60,
  cardPadding: 16,
  screenPadding: {
    mobile: 16,
    desktop: 24,
  },
};

// Z-index layers
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  tooltip: 500,
};


