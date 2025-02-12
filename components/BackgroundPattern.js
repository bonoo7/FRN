import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Pattern, Path, Rect, Defs } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

export const BackgroundPattern = ({ children, style, patternId = 'pattern' }) => {
  const { theme } = useTheme();
  const pattern = theme.colors.background.pattern;
  const patternRef = useRef(null);

  // التأكد من وجود النمط وإعداداته
  const defaultPattern = {
    color: theme.colors.primary,
    opacity: 0.15,
    type: pattern?.type || 'grid',
    size: pattern?.size || 24,
    rotation: pattern?.rotation || 45,
    density: pattern?.density || 1
  };

  const [currentPattern, setCurrentPattern] = useState(pattern || defaultPattern);

  // التأكد من تحديث النمط عند تغيير الثيم
  useEffect(() => {
    if (pattern) {
      setCurrentPattern(pattern);
    }
  }, [theme]);

  // إعادة تحميل النمط عند تغيير patternId
  useEffect(() => {
    if (patternRef.current) {
      // تحديث النمط بشكل قسري
      patternRef.current.setNativeProps({
        fill: `url(#${patternId}-${Date.now()})`
      });
    }
  }, [patternId]);

  const renderPattern = () => {
    switch (currentPattern.type) {
      case 'hearts':
        return (
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={currentPattern.color}
            opacity={currentPattern.opacity}
            transform={`rotate(${currentPattern.rotation}, 12, 12)`}
          />
        );
      case 'stars':
        return (
          <Path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={currentPattern.color}
            opacity={currentPattern.opacity}
            transform={`rotate(${currentPattern.rotation}, 12, 12)`}
          />
        );
      case 'grid':
      default:
        const density = currentPattern.density || 1;
        const pathSize = currentPattern.size * density;
        return (
          <>
            <Path
              d={`M ${pathSize/2} 0 L ${pathSize} ${pathSize/2} L ${pathSize/2} ${pathSize} L 0 ${pathSize/2} Z`}
              fill="none"
              stroke={currentPattern.color}
              strokeWidth={2}
              opacity={currentPattern.opacity}
            />
            <Path
              d={`M 0 0 L ${pathSize} ${pathSize} M ${pathSize} 0 L 0 ${pathSize}`}
              fill="none"
              stroke={currentPattern.color}
              strokeWidth={1}
              opacity={currentPattern.opacity * 0.5}
            />
          </>
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.secondary
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.patternOverlay]}>
        <Svg height="100%" width="100%">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width={currentPattern.size}
              height={currentPattern.size}
            >
              {renderPattern()}
            </Pattern>
          </Defs>
          <Rect
            ref={patternRef}
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${patternId})`}
          />
        </Svg>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  patternOverlay: {
    opacity: 0.8,
  },
});