import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import DifficultySelector from '../components/DifficultySelector';
import TimeLimitSlider from '../components/TimeLimitSlider';
import StartPracticeButton from '../components/StartPracticeButton';
import BackgroundPattern from '../components/BackgroundPattern';
import { useTheme } from '@react-navigation/native';
import { SPACING } from '../constants/spacing';

const PracticeMode = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLimit, setTimeLimit] = useState(60);
  const theme = useTheme();
  
  return (
    <BackgroundPattern style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <SafeAreaView style={[styles.container]}>
        <View style={styles.mainContainer}>
          <View style={[styles.content, { backgroundColor: theme.colors.background.card }]}>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <TimeLimitSlider value={timeLimit} onChange={setTimeLimit} />
            <StartPracticeButton onPress={startPractice} />
          </View>
        </View>
      </SafeAreaView>
    </BackgroundPattern>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: SPACING.md,
  },
  content: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    padding: SPACING.md,
  },
});

export default PracticeMode; 