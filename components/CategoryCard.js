import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories.js';
import { useTheme } from '../contexts/ThemeContext';
import { withThemeStyles } from '../styles/styles';
import { wp } from '../styles/responsive';

// التأكد من وجود الصورة
const getCategoryImage = (category) => {
  const image = categoryImages[category];
  if (!image) {
    console.warn(`No image found for category: ${category}`);
    return categoryImages['معلومات عامة']; // صورة افتراضية
  }
  return image;
};

export const CategoryCard = ({ 
  category, 
  isSelected, 
  order, 
  onPress, 
  onLongPress,
}) => {
  const { theme } = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isSelected ? 1.05 : 1) },
    ],
  }));

  const platformStyles = Platform.select({
    web: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    default: {
      elevation: 2,
    }
  });

  return (
    <Animated.View style={[
      styles.container, 
      { borderColor: theme.colors.border },
      animatedStyle
    ]}>
      <TouchableOpacity 
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.touchable}
      >
        {isSelected && (
          <View style={styles.orderBadge}>
            <Text style={styles.orderText}>{order}</Text>
          </View>
        )}
        <LinearGradient
          colors={isSelected ? theme.colors.gradient.primary : [theme.colors.background.card, theme.colors.background.card]}
          style={[styles.categoryContent, platformStyles]}
        >
          <Image 
            source={getCategoryImage(category)}
            style={[styles.image, isSelected && styles.selectedImage]}
            resizeMode="contain"
          />
          <Text style={[
            styles.title,
            { color: isSelected ? theme.colors.text.light : theme.colors.text.primary }
          ]}>
            {category}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(18),
    aspectRatio: 1,
    borderRadius: 12,
    margin: SPACING.xs,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  image: {
    width: wp(10),
    height: wp(10),
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  orderBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 3,
  },
  orderText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.bold,
    color: '#000',
  },
  touchable: {
    flex: 1,
  },
  categoryContent: {
    flex: 1,
    borderRadius: 12,
    padding: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
}); 