import { StyleSheet, Platform } from 'react-native';
import { SPACING, FONTS, SHADOWS } from './theme';

export const createGlobalStyles = (theme) => StyleSheet.create({
  // أنماط الحاويات المشتركة
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // أنماط البطاقات المشتركة
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: SPACING.md,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }
    })
  },
  
  // أنماط الأزرار المشتركة
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  // أنماط النصوص المشتركة
  title: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
  },
  
  subtitle: {
    fontSize: FONTS.sizes.subtitle,
  },
  
  // أنماط القوائم المشتركة
  list: {
    padding: SPACING.md,
  },
  
  // أنماط الإدخال المشتركة
  input: {
    borderRadius: 8,
    padding: SPACING.sm,
    borderWidth: 1,
  },
});

// أنماط مساعدة للثيم
export const withThemeStyles = (styles, theme) => {
  return typeof styles === 'function' ? styles(theme) : styles;
}; 