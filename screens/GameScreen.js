import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, Image, Platform } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { GameService } from '../services/gameService';
import { TeamsHeader } from '../components/TeamsHeader';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { StorageService } from '../services/storageService';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories';
import QuestionDetailsModal from '../components/QuestionDetailsModal';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
    borderBottomWidth: 1,
    marginBottom: 2,
  },
  categoryImage: {
    width: 36,
    height: 36,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
  },
  categoryTitle: {
    flex: 1,
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.bold,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  questionsContainer: {
    padding: SPACING.xs,
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    margin: 2,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 2,
    gap: 2,
    padding: 2,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  errorText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
});

const QuestionButton = ({ difficulty, isUsed, points, onPress, theme }) => {
  const difficultyColors = {
    'سهل': theme.colors.gradient?.success || ['#4CAF50', '#388E3C'],
    'متوسط': theme.colors.gradient?.warning || ['#FFA000', '#FFD740'],
    'صعب': ['#FF0000', '#D32F2F'],  // أحمر غامق
  };

  const difficultyBackgrounds = {
    'سهل': `${theme.colors.success}20`,
    'متوسط': `${theme.colors.warning}20`,
    'صعب': `${theme.colors.error}20`,
  };

  const difficultyBorders = {
    'سهل': theme.colors.success,
    'متوسط': theme.colors.warning,
    'صعب': '#FF0000',  // أحمر
  };

  const styles = StyleSheet.create({
    questionButton: {
      flex: 1,
      maxWidth: 45,
      minWidth: 40,
      margin: 2,
      borderRadius: 6,
      borderWidth: 0,
      overflow: 'hidden',
    },
    questionGradient: {
      padding: 4,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      height: 24,
      backdropFilter: 'blur(8px)',
    },
    questionUsed: {
      opacity: 0.7,
      backgroundColor: theme.colors.disabled,
    },
    pointsText: {
      color: '#FFFFFF',
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.bold,
      textShadow: '0px 1px 3px rgba(0,0,0,0.3)',
    },
  });

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.questionButton,
        {
          shadowColor: theme.colors.primary,
          shadowOpacity: isUsed ? 0 : 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }
      ]}
    >
      <LinearGradient
        colors={isUsed ? [theme.colors.disabled, theme.colors.disabled] : (difficultyColors[difficulty] || ['#808080', '#606060'])}
        style={[styles.questionGradient, isUsed && styles.questionUsed]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[
          styles.pointsText,
          isUsed && { color: theme.colors.text.disabled }
        ]}>
          {points}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const CategoryColumn = ({ category, questions = {}, onQuestionPress, style, theme }) => {
  const columnStyles = StyleSheet.create({
    column: {
      flex: 1,
      minWidth: 150,
      maxWidth: 180,
      margin: 4,
      backgroundColor: `${theme.colors.background.surface}CC`,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    }
  });

  return (
    <View style={[columnStyles.column, style]}>
      <View style={[
        staticStyles.categoryHeader,
        { 
          background: `linear-gradient(45deg, ${theme.colors.background.card}CC, ${theme.colors.background.surface}99)`,
          borderBottomColor: theme.colors.border,
        }
      ]}>
        <Image 
          source={categoryImages[category]} 
          style={staticStyles.categoryImage}
          resizeMode="contain"
        />
        <Text style={[staticStyles.categoryTitle, { color: theme.colors.text.primary }]}>
          {category}
        </Text>
      </View>
      
      <View style={[
        staticStyles.questionsContainer,
        { background: `linear-gradient(to bottom, ${theme.colors.background.surface}20, transparent)` }
      ]}>
        {['سهل', 'متوسط', 'صعب'].map((difficulty) => (
          <View key={difficulty} style={staticStyles.difficultyRow}>
            {(questions[difficulty] || []).map((question, qIndex) => (
              <QuestionButton
                key={`${difficulty}-${qIndex}`}
                difficulty={difficulty}
                isUsed={question.isUsed}
                points={question.points}
                onPress={() => onQuestionPress(category, difficulty, qIndex)}
                theme={theme}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const GameScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const styles = StyleSheet.create({
    ...staticStyles,
    container: {
      ...staticStyles.container,
      backgroundColor: theme.colors.background.primary,
    },
  });
  
  const [gameData, setGameData] = useState(null);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isDoublePoints, setIsDoublePoints] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [teams, setTeams] = useState([]);
  const [usedDoublePoints, setUsedDoublePoints] = useState({});
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null);

  const screenWidth = Dimensions.get('window').width;
  const isLandscape = screenWidth > Dimensions.get('window').height;
  const isSmallScreen = screenWidth < 768;

  const getColumnWidth = () => {
    if (isLandscape) {
      return (screenWidth / 6) - SPACING.xs;
    }
    if (screenWidth >= 1200) return (screenWidth / 6) - SPACING.xs;
    if (screenWidth >= 768) return (screenWidth / 4) - SPACING.xs;
    if (screenWidth >= 480) return (screenWidth / 2) - SPACING.xs;
    return screenWidth - SPACING.xs;
  };

  const updateCurrentTeam = useCallback(async (newIndex) => {
    try {
      const gameData = await StorageService.getCurrentGame();
      if (!gameData?.teams?.length) return;
      
      setCurrentTeamIndex(newIndex);
      gameData.currentTeamIndex = newIndex;
      await StorageService.saveCurrentGame(gameData);
      await loadGameData();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  }, []);

  const moveToNextTeam = useCallback(async () => {
    try {
      const gameData = await StorageService.getCurrentGame();
      if (!gameData?.teams?.length) return;
      
      const currentIndex = gameData.currentTeamIndex || 0;
      const nextTeamIndex = (currentIndex + 1) % gameData.teams.length;

      await updateCurrentTeam(nextTeamIndex);
    } catch (error) {
      console.error('Error moving to next team:', error);
    }
  }, [updateCurrentTeam]);

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    if (params.shouldRefresh && params.shouldRefresh !== lastRefreshTime) {
      setLastRefreshTime(params.shouldRefresh);
      loadGameData();
      if (params.shouldMoveNext) {
        setTimeout(() => {
          moveToNextTeam();
        }, 100);
      }
    }
  }, [params.shouldRefresh, moveToNextTeam, lastRefreshTime]);

  useFocusEffect(
    React.useCallback(() => {
      loadGameData();
      setIsLoading(false);
    }, [])
  );

  const parseTeams = (teamsData) => {
    try {
      if (!teamsData) return [];
      const parsed = Array.isArray(teamsData) ? teamsData : JSON.parse(teamsData);
      console.log('Parsed teams in game:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing teams:', error);
      return [];
    }
  };

  const loadGameData = async () => {
    try {
      setIsLoading(true);
      const data = await StorageService.getCurrentGame();
      
      console.log('Loaded game data:', {
        categories: data.categories,
        questions: data.questions,
        teams: data.teams
      });

      if (!data) {
        throw new Error('لم يتم العثور على بيانات اللعبة');
      }

      if (!data.questions || !data.categories || !data.teams) {
        throw new Error('بيانات اللعبة غير مكتملة');
      }

      const savedTeams = parseTeams(data.teams);
      setTeams(savedTeams);
      setCurrentTeamIndex(data.currentTeamIndex || 0);
      setScores(data.scores);
      data.usedDoublePoints = data.usedDoublePoints || {};
      setGameData(data);
      setUsedDoublePoints(data.usedDoublePoints);
    } catch (error) {
      console.error('Error loading game data:', error.message);
      Alert.alert('خطأ', 'حدث خطأ في تحميل بيانات اللعبة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoublePointsChange = async (newValue) => {
    const currentTeam = gameData.teams[gameData.currentTeamIndex];
    
    if (newValue && usedDoublePoints[currentTeam]) {
      Alert.alert(
        'تنبيه',
        'تم استخدام مضاعفة النقاط لهذا الفريق في هذه الجولة'
      );
      return;
    }
    
    try {
      setIsDoublePoints(newValue);
    } catch (error) {
      console.error('Error updating double points:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث حالة مضاعفة النقاط');
    }
  };

  const showQuestionDetails = (question, category, difficulty) => {
    setSelectedQuestionDetails({
      question: question.question,
      answer: question.answer,
      category,
      difficulty,
      answeredBy: question.answeredBy,
      wasDoublePoints: question.wasDoublePoints,
      earnedPoints: question.earnedPoints,
      answeredAt: question.answeredAt
    });
    setModalVisible(true);
  };

  const handleQuestionPress = async (category, difficulty, questionIndex) => {
    const question = gameData.questions[category][difficulty][questionIndex];
    const currentTeam = gameData.teams[gameData.currentTeamIndex];
    
    if (!question) {
      console.error('السؤال غير موجود:', {
        category,
        difficulty,
        questionIndex
      });
      return;
    }

    // إذا كان السؤال معطل، نعرض تفاصيله في المودال
    if (question.isUsed) {
      showQuestionDetails(question, category, difficulty);
      return;
    }

    const questionData = {
      ...question,
      category,
      difficulty,
      index: questionIndex,
      teamName: currentTeam,
      isDoublePoints,
      points: question.points || (difficulty === 'سهل' ? 50 : difficulty === 'متوسط' ? 100 : 200)
    };

    if (!questionData.question || !questionData.answer) {
      console.error('بيانات السؤال غير مكتملة:', questionData);
      return;
    }

    try {
      if (isDoublePoints) {
        const updatedGameData = {
          ...gameData,
          usedDoublePoints: {
            ...gameData.usedDoublePoints,
            [currentTeam]: true
          }
        };
        await StorageService.saveCurrentGame(updatedGameData);
        setGameData(updatedGameData);
        setUsedDoublePoints(updatedGameData.usedDoublePoints);
      }

      router.push({
        pathname: '/game/question',
        params: {
          questionData: JSON.stringify(questionData)
        }
      });
      
      setIsDoublePoints(false);
    } catch (error) {
      console.error('Error navigating to question:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء فتح السؤال');
    }
  };

  const handleEndRound = async () => {
    try {
      if (!gameData || !gameData.teams || !gameData.scores) {
        throw new Error('بيانات اللعبة غير مكتملة');
      }

      console.log('بدء إنهاء الجولة...');

      const statistics = {
        totalQuestions: 0,
        answeredQuestions: 0,
        doublePointsUsed: 0,
        categoryStats: {}
      };

      Object.entries(gameData.questions).forEach(([category, difficulties]) => {
        statistics.categoryStats[category] = {
          total: 0,
          answered: 0
        };
        
        Object.values(difficulties).forEach(questions => {
          questions.forEach(question => {
            statistics.totalQuestions++;
            statistics.categoryStats[category].total++;
            
            if (question.isUsed) {
              statistics.answeredQuestions++;
              statistics.categoryStats[category].answered++;
              if (question.wasDoublePoints) {
                statistics.doublePointsUsed++;
              }
            }
          });
        });
      });

      const gameResults = {
        roundName: gameData.roundName,
        teams: gameData.teams,
        scores: gameData.scores,
        categories: gameData.categories,
        statistics: statistics,
        winner: Object.entries(gameData.scores)
          .sort(([,a], [,b]) => b - a)[0][0],
        timestamp: new Date().toISOString()
      };

      await StorageService.saveGameToHistory(gameResults);
      setUsedDoublePoints({});

      router.push({
        pathname: '/round-results',
        params: {
          gameData: JSON.stringify(gameResults)
        }
      });
    } catch (error) {
      console.error('خطأ في إنهاء الجولة:', error);
      Alert.alert('خطأ', 'حدث خطأ في إنهاء الجولة');
    }
  };

  if (isLoading) {
    return (
      <BackgroundPattern>
        <View style={[staticStyles.container, staticStyles.loadingContainer]}>
          <Text style={[staticStyles.loadingText, { color: theme.colors.text.primary }]}>
            جاري تحميل اللعبة...
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  if (!teams.length) {
    return (
      <BackgroundPattern>
        <View style={[staticStyles.container, staticStyles.loadingContainer]}>
          <Text style={[staticStyles.errorText, { color: theme.colors.error }]}>
            لم يتم العثور على بيانات الفرق
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  return (
    <BackgroundPattern
      style={{ flex: 1 }}
      patternId="gameScreenPattern"
    >
      <Stack.Screen 
        options={{ 
          headerShown: false,
          animation: 'none'
        }} 
      />
      <View style={[staticStyles.container, { backgroundColor: 'transparent' }]}>
        <TeamsHeader
          teams={gameData.teams}
          currentTeamIndex={gameData.currentTeamIndex}
          scores={gameData.scores}
          onTeamChange={updateCurrentTeam}
          onEndRound={handleEndRound}
          isDoublePoints={isDoublePoints}
          onDoublePointsChange={handleDoublePointsChange}
          usedDoublePoints={usedDoublePoints}
        />

        <BackgroundPattern
          style={[
            staticStyles.categoriesContainer,
            {
              backgroundColor: `${theme.colors.background.card}95`,
              borderColor: theme.colors.border,
              borderWidth: 1,
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }
          ]}
          patternId="categoriesContainerPattern"
        >
          <ScrollView
            style={staticStyles.scrollView}
            contentContainerStyle={staticStyles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            {gameData.categories.map((category) => (
              <CategoryColumn
                key={category}
                category={category}
                questions={gameData.questions[category]}
                onQuestionPress={handleQuestionPress}
                style={{ 
                  width: getColumnWidth(),
                  backgroundColor: `${theme.colors.background.surface}95`,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                theme={theme}
              />
            ))}
          </ScrollView>
        </BackgroundPattern>

        <QuestionDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          details={selectedQuestionDetails}
          theme={theme}
        />
      </View>
    </BackgroundPattern>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xs,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  errorText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
});

export default GameScreen;
