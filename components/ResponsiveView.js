import React from 'react';
import { View, StyleSheet } from 'react-native';
import { wp, hp } from '../styles/responsive';

const ResponsiveView = ({ 
  children, 
  style, 
  minWidth, 
  maxWidth,
  padding,
  margin,
  center
}) => {
  const containerStyle = [
    styles.container,
    minWidth && { minWidth: wp(minWidth) },
    maxWidth && { maxWidth: wp(maxWidth) },
    padding && { padding: padding },
    margin && { margin: margin },
    center && styles.center,
    style
  ];

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ResponsiveView; 