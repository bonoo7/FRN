import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/styles';

const CustomButton = ({ onPress, colors }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        theme.components.button.background(colors || theme.colors.gradient.button)
      ]}
      onPress={onPress}
    >
      {/* محتوى الزر */}
    </TouchableOpacity>
  );
};

export default CustomButton; 