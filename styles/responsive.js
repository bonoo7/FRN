import { Dimensions, StyleSheet } from 'react-native';
import { SPACING, FONTS } from './theme';

const { width, height } = Dimensions.get('window');

// نقاط التحول للشاشات المختلفة
export const breakpoints = {
  smallPhone: 320,
  phone: 480,
  tablet: 768,
  desktop: 1024
};

// حساب النسب المئوية للشاشة
export const wp = (percentage) => {
  return (width * percentage) / 100;
};

export const hp = (percentage) => {
  return (height * percentage) / 100;
};

// تحديد الأحجام حسب نوع الشاشة
export const getResponsiveSize = () => {
  if (width <= breakpoints.smallPhone) return 'xsmall';
  if (width <= breakpoints.phone) return 'small';
  if (width <= breakpoints.tablet) return 'medium';
  if (width <= breakpoints.desktop) return 'large';
  return 'xlarge';
};

// الأحجام المتجاوبة للخطوط والمسافات
export const responsiveSizes = {
  xsmall: {
    h1: 16,
    h2: 14,
    h3: 12,
    body: 10,
    caption: 8,
    padding: 6,
    margin: 4
  },
  small: {
    h1: 18,
    h2: 16,
    h3: 14,
    body: 12,
    caption: 10,
    padding: 8,
    margin: 6
  },
  medium: {
    h1: 20,
    h2: 18,
    h3: 16,
    body: 14,
    caption: 12,
    padding: 10,
    margin: 8
  },
  large: {
    h1: 24,
    h2: 20,
    h3: 18,
    body: 16,
    caption: 14,
    padding: 12,
    margin: 10
  },
  xlarge: {
    h1: 28,
    h2: 24,
    h3: 20,
    body: 18,
    caption: 16,
    padding: 16,
    margin: 12
  }
};

// الحصول على الأحجام المناسبة للشاشة الحالية
export const getResponsiveStyles = () => {
  const isSmallScreen = width < breakpoints.tablet;
  
  return {
    isSmallScreen,
    padding: isSmallScreen ? SPACING.md : SPACING.lg,
    margin: isSmallScreen ? SPACING.sm : SPACING.md,
  };
};

// استماع للتغييرات في حجم الشاشة
export const useResponsiveListener = (callback) => {
  Dimensions.addEventListener('change', () => {
    callback(getResponsiveStyles());
  });
}; 