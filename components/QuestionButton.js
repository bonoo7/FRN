import React from 'react';
import { TouchableOpacity } from 'react-native';

const getDifficultyColor = (difficulty, theme) => {
  switch (difficulty) {
    case 'easy':
      return theme.colors.success;
    case 'medium':
      return theme.colors.warning;
    case 'hard':
      return theme.colors.error;
    default:
      return theme.colors.primary;
  }
};

const getDifficultyGradient = (difficulty, theme) => {
  switch (difficulty) {
    case 'easy':
      return theme.colors.gradient.success;
    case 'medium':
      return ['#FFA726', '#FB8C00'];  // برتقالي
    case 'hard':
      return theme.colors.gradient.error;
    default:
      return theme.colors.gradient.primary;
  }
};

const QuestionButton = ({ difficulty, points, onPress, theme }) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={`سؤال ${difficulty} - ${points} نقطة`}
      accessibilityHint="انقر لعرض السؤال"
      accessibilityRole="button"
      onPress={onPress}
      style={{
        backgroundColor: getDifficultyColor(difficulty, theme),
      }}
    >
      {/* محتوى الزر */}
    </TouchableOpacity>
  );
};

export default QuestionButton; 