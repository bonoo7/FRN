import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { BackgroundPattern } from '../../components/BackgroundPattern';
import { StorageService } from '../../services/storageService';
import { GameService } from '../../services/gameService';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, FONTS } from '../../styles/theme';
import categoryImages from '../../assets/categories';
import GameSetup from '../../screens/GameSetup';

const GameSetupScreen = () => {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'إعداد اللعبة',
          headerShown: false
        }} 
      />
      <GameSetup />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  categoriesContainer: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  categoriesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryButton: {
    padding: SPACING.md,
    borderRadius: 8,
    minWidth: 150,
    margin: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryImage: {
    width: 60,
    height: 60,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  startButton: {
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  infoText: {
    fontSize: FONTS.sizes.caption,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
});

export default GameSetupScreen; 