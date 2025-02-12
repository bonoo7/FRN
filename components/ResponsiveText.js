import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { getResponsiveStyles } from '../styles/responsive';

const ResponsiveText = ({ 
  children, 
  style, 
  type = 'body', // h1, h2, h3, body, caption
  weight = 'regular', // regular, medium, bold
  ...props 
}) => {
  const responsiveStyles = getResponsiveStyles();
  
  const textStyle = [
    { fontSize: responsiveStyles[type] },
    styles[weight],
    style
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
  },
});

export default ResponsiveText; 