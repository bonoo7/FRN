import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS, SHADOWS } from '../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

const themeOptions = [
  { id: 'blue', name: 'أزرق', color: '#4A6FFF', icon: 'water' },
  { id: 'dark', name: 'داكن', color: '#1A1A1A', icon: 'nights-stay' },
  { id: 'gold', name: 'ذهبي', color: '#FFD700', icon: 'star' },
  { id: 'purple', name: 'وردي', color: '#FF69B4', icon: 'favorite' },
];

export const ThemeSelector = () => {
  const { theme, currentTheme, changeTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const handleThemeChange = (newTheme) => {
    if (changeTheme) {
      changeTheme(newTheme);
    }
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setIsVisible(true)}
        style={[
          styles.button, 
          { backgroundColor: theme.colors.primary }
        ]}
      >
        <MaterialIcons 
          name="palette" 
          size={24} 
          color={theme.colors.text.light} 
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable 
          style={({ pressed }) => [
            styles.modalOverlay,
            { backgroundColor: pressed ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.5)' }
          ]}
          onPress={() => setIsVisible(false)}
        >
          <View 
            style={[
              styles.themeMenu,
              { 
                backgroundColor: theme.colors.background.card,
                borderColor: theme.colors.border.light,
              }
            ]}
          >
            {themeOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: currentTheme === option.id ? 
                      option.color : theme.colors.background.card,
                    borderColor: theme.colors.border.light,
                  }
                ]}
                onPress={() => handleThemeChange(option.id)}
              >
                <View style={styles.themeContent}>
                  <MaterialIcons 
                    name={option.icon} 
                    size={24} 
                    color={currentTheme === option.id ? 
                      theme.colors.text.light : option.color} 
                  />
                  <Text style={[
                    styles.themeName,
                    { 
                      color: currentTheme === option.id ? 
                        theme.colors.text.light : theme.colors.text.primary,
                      marginLeft: SPACING.sm
                    }
                  ]}>
                    {option.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.sm,
    backgroundColor: 'transparent',
  },
  button: {
    padding: SPACING.sm,
    borderRadius: SPACING.sm,
    ...SHADOWS.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: SPACING.md,
  },
  themeMenu: {
    minWidth: 180,
    borderRadius: 12,
    padding: SPACING.sm,
    borderWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 8,
      }
    }),
  },
  themeOption: {
    borderRadius: 8,
    padding: SPACING.md,
    marginVertical: SPACING.xxs,
    borderWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
      default: {
        elevation: 1,
      }
    }),
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeName: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
}); 