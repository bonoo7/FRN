import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';
import { StorageService } from '../services/storageService';

const getDifficultyTime = (difficulty) => {
  switch (difficulty) {
    case 'سهل': return 60; // دقيقة
    case 'متوسط': return 90; // دقيقة ونصف
    case 'صعب': return 120; // دقيقتين
    default: return 60;
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const QuestionScreen = ({ questionData }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isQuestionHandled, setIsQuestionHandled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [teams, setTeams] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [remainingTeams, setRemainingTeams] = useState([]);
  const [currentQuestionTeam, setCurrentQuestionTeam] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isLandscape = screenWidth > screenHeight;
  const isSmallScreen = screenWidth < 768;

  useEffect(() => {
    const loadTeams = async () => {
      const gameData = await StorageService.getCurrentGame();
      const allTeams = gameData.teams || [];
      setTeams(allTeams);
      
      // البدء من الفريق النشط في شاشة اللعب
      const startTeam = questionData.teamName;
      const startIndex = allTeams.findIndex(team => team === startTeam);
      
      // ترتيب الفرق بدءاً من الفريق النشط
      const orderedTeams = [
        ...allTeams.slice(startIndex),
        ...allTeams.slice(0, startIndex)
      ];
      setRemainingTeams(orderedTeams);
      setCurrentQuestionTeam(orderedTeams[0]);
    };
    loadTeams();
  }, [questionData.teamName]);

  useEffect(() => {
    if (!questionData) return;
    setTimeLeft(getDifficultyTime(questionData.difficulty));
  }, [questionData]);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const handleTimerEnd = useCallback(async () => {
    if (remainingTeams.length <= 1) {
      setIsAnswerRevealed(true);
      setIsTimerActive(false);
    } else {
      const nextTeams = remainingTeams.slice(1);
      setRemainingTeams(nextTeams);
      setCurrentQuestionTeam(nextTeams[0]);
      setTimeLeft(getDifficultyTime(questionData.difficulty));
      setIsTimerActive(true);
    }
  }, [remainingTeams, questionData]);

  const handleSkip = async () => {
    if (!isTimerActive || isAnswerRevealed) return;
    await handleTimerEnd();
  };

  const handleTeamAnswer = async (teamName) => {
    if (isQuestionHandled) return;
    try {
      setIsQuestionHandled(true);
      const gameData = await StorageService.getCurrentGame();
      if (!gameData) throw new Error('لم يتم العثور على بيانات اللعبة');
      
      const { category, difficulty, index } = questionData;
      const actualPoints = questionData.points * (questionData.isDoublePoints ? 2 : 1);
      
      if (teamName !== 'none') {
        gameData.scores[teamName] = (gameData.scores[teamName] || 0) + actualPoints;
      }

      if (gameData.questions[category]?.[difficulty]?.[index]) {
        gameData.questions[category][difficulty][index] = {
          ...gameData.questions[category][difficulty][index],
          isUsed: true,
          answeredBy: teamName,
          wasDoublePoints: questionData.isDoublePoints,
          earnedPoints: actualPoints,
          answeredAt: new Date().toISOString(),
          question: questionData.question,
          answer: questionData.answer,
          points: questionData.points
        };
      }
      
      await StorageService.saveCurrentGame(gameData);
      
      router.back();
      // بعد العودة للشاشة السابقة، نقوم بتحديث البيانات
      setTimeout(() => {
        router.setParams({ 
          shouldRefresh: Date.now(),
          shouldMoveNext: true
        });
      }, 100);
    } catch (error) {
      console.error('Error handling team answer:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ النتيجة');
      setIsQuestionHandled(false);
    }
  };

  if (!questionData) {
    return (
      <BackgroundPattern>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            جاري تحميل السؤال...
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  const {
    question,
    answer,
    category,
    difficulty,
    points,
    teamName,
    isDoublePoints
  } = questionData;

  const actualPoints = isDoublePoints ? points * 2 : points;

  return (
    <BackgroundPattern
      style={{ flex: 1 }}
      patternId="questionScreenPattern"
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={[
          styles.card,
          {
            backgroundColor: `${theme.colors.background.card}CC`,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }
        ]}>
          <BackgroundPattern patternId="questionCard">
            <View style={styles.header}>
              <Text style={[styles.category, { color: theme.colors.text.primary }]}>
                {category}
              </Text>
              <Text style={[styles.points, { color: theme.colors.text.primary }]}>
                {actualPoints} نقطة
              </Text>
            </View>

            <Text style={[styles.teamName, { color: theme.colors.text.primary }]}>
              {currentQuestionTeam}
            </Text>

            {!isAnswerRevealed && (
              <Text style={[
                styles.timer,
                { color: timeLeft <= 10 ? theme.colors.error : theme.colors.text.primary },
                isLandscape && styles.timerLandscape
              ]}>
                {formatTime(timeLeft)}
              </Text>
            )}

            <Text style={[styles.question, { color: theme.colors.text.primary }]}>
              {question}
            </Text>

            {isAnswerRevealed && (
              <Text style={[styles.answer, { color: theme.colors.text.primary }]}>
                {answer}
              </Text>
            )}
          </BackgroundPattern>

          <View style={[
            styles.buttonsContainer,
            isLandscape && styles.buttonsContainerLandscape
          ]}>
            {!isAnswerRevealed ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.colors.primary },
                    isLandscape && styles.buttonLandscape
                  ]}
                  onPress={() => setIsAnswerRevealed(true)}
                >
                  <Text style={[
                    styles.buttonText,
                    isLandscape && styles.buttonTextLandscape
                  ]}>
                    إظهار الإجابة
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.colors.warning },
                    (!isTimerActive || remainingTeams.length <= 1) && styles.buttonDisabled,
                    isLandscape && styles.buttonLandscape
                  ]}
                  onPress={handleSkip}
                  disabled={!isTimerActive || remainingTeams.length <= 1}
                >
                  <Text style={[
                    styles.buttonText,
                    isLandscape && styles.buttonTextLandscape
                  ]}>
                    تثبيت
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.teamsAnswerContainer}>
                <View style={styles.teamsRow}>
                  {teams.map((team) => (
                    <TouchableOpacity
                      key={team}
                      style={[
                        styles.teamAnswerButton,
                        { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => handleTeamAnswer(team)}
                    >
                      <Text style={[styles.buttonText, styles.teamButtonText]}>
                        {team}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.teamAnswerButton,
                    { backgroundColor: theme.colors.error }
                  ]}
                  onPress={() => handleTeamAnswer('none')}
                >
                  <Text style={styles.buttonText}>
                    لم يجب أحد
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </BackgroundPattern>
  );
};

const styles = StyleSheet.create({
  backgroundPattern: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  containerLandscape: {
    padding: SPACING.sm,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.medium,
  },
  card: {
    padding: SPACING.md,
    borderRadius: 16,
    gap: SPACING.md,
    maxWidth: Platform.select({ web: 800, default: '100%' }),
    alignSelf: 'center',
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  category: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
  categoryLandscape: {
    fontSize: FONTS.sizes.caption,
  },
  points: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  pointsLandscape: {
    fontSize: FONTS.sizes.body,
  },
  teamName: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    width: '100%',
  },
  teamNameLandscape: {
    fontSize: FONTS.sizes.h4,
  },
  question: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
    marginVertical: SPACING.md,
    width: '100%',
    flex: 1,
  },
  questionLandscape: {
    fontSize: FONTS.sizes.h3,
    marginVertical: SPACING.sm,
  },
  answer: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginVertical: SPACING.md,
    width: '100%',
  },
  answerLandscape: {
    fontSize: FONTS.sizes.h4,
    marginVertical: SPACING.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '100%',
  },
  buttonsContainerLandscape: {
    gap: SPACING.sm,
  },
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonLandscape: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
  },
  buttonTextLandscape: {
    fontSize: FONTS.sizes.caption,
  },
  timer: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  timerLandscape: {
    fontSize: FONTS.sizes.h3,
    marginVertical: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  teamsAnswerContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  teamsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  teamAnswerButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  teamButtonText: {
    fontSize: FONTS.sizes.body,
    textAlign: 'center',
  },
});

export default QuestionScreen; 