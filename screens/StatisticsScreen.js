import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import { StorageService } from '../services/storageService';
import { questions } from '../data/questions';
import { getResponsiveStyles } from '../styles/responsive';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { MaterialIcons } from '@expo/vector-icons';

const DIFFICULTY_COLORS = {
  'سهل': ['#00C853', '#69F0AE'],    // أخضر
  'متوسط': ['#FFA000', '#FFD740'],  // برتقالي
  'صعب': ['#FF1744', '#FF5252']     // أحمر
};

const GradientContainer = ({ children, colors, style }) => {
  if (Platform.OS === 'web') {
    return (
      <View 
        style={[
          style,
          { 
            backgroundColor: colors?.[0] || '#4A6FFF',
            background: `linear-gradient(45deg, ${colors?.[0] || '#4A6FFF'}, ${colors?.[1] || '#6C8FFF'})`
          }
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={colors || ['#4A6FFF', '#6C8FFF']}
      style={style}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const StatisticsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [questionsStats, setQuestionsStats] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const responsiveStyles = getResponsiveStyles();
  const window = Dimensions.get('window');
  const isLandscape = window.width > window.height;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    navigationBar: {
      height: 56,
      width: '100%',
      backgroundColor: theme.colors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      ...Platform.select({
        web: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        },
        default: {
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }
      }),
    },
    mainContainer: {
      flex: 1,
      padding: SPACING.md,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      gap: SPACING.md,
      padding: SPACING.md,
    },
    loadingText: {
      textAlign: 'center',
      marginTop: SPACING.xl,
      color: theme.colors.text.primary,
      fontSize: FONTS.sizes.body,
    },
    section: {
      backgroundColor: theme.colors.background.card,
      borderRadius: 12,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      padding: SPACING.md,
      borderRadius: 12,
      marginBottom: SPACING.sm,
      backgroundColor: theme.colors.primary,
    },
    headerText: {
      fontSize: FONTS.sizes.h2,
      fontWeight: FONTS.weights.bold,
      textAlign: 'center',
      color: theme.colors.text.onPrimary,
    },
    statsCard: {
      backgroundColor: theme.colors.background.card,
      borderRadius: 12,
      padding: SPACING.md,
      marginBottom: SPACING.md,
    },
    statRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.xs,
    },
    categoryName: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      marginBottom: SPACING.xs,
      color: theme.colors.text.primary,
    },
    totalQuestions: {
      fontSize: FONTS.sizes.caption,
      marginBottom: SPACING.sm,
      color: theme.colors.text.secondary,
    },
    difficultyContainer: {
      gap: SPACING.xs,
    },
    difficultyCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.xs,
      borderRadius: 6,
    },
    difficultyText: {
      color: '#FFFFFF',
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.medium,
    },
    difficultyCount: {
      color: '#FFFFFF',
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
    },
    gameName: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      marginBottom: SPACING.xs,
      color: theme.colors.text.primary,
    },
    teamsContainer: {
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      fontSize: FONTS.sizes.body,
      marginBottom: SPACING.sm,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.primary,
    },
    teamRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.xs,
    },
    teamName: {
      fontSize: FONTS.sizes.body,
      color: theme.colors.text.primary,
    },
    teamScore: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.text.primary,
    },
    categoriesContainer: {
      marginTop: SPACING.sm,
    },
    categoriesList: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      gap: SPACING.xs,
    },
    categoryTag: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
    },
    categoryTagText: {
      fontSize: FONTS.sizes.caption,
      color: theme.colors.text.onPrimary,
    },
    noDataText: {
      textAlign: 'center',
      fontSize: FONTS.sizes.body,
      color: theme.colors.text.secondary,
      marginTop: SPACING.xl,
    },
    backButton: {
      padding: SPACING.sm,
    },
    backButtonText: {
      fontSize: FONTS.sizes.body,
      color: theme.colors.text.primary,
    },
    landscapeContent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
      padding: SPACING.md,
    },
    portraitContent: {
      flexDirection: 'column',
      padding: SPACING.md,
    },
    generalStatsSection: {
      width: '100%',
    },
    sideSection: {
      flex: 1,
      minWidth: isLandscape ? 300 : '100%',
      maxWidth: isLandscape ? '50%' : '100%',
    },
    cardGrid: {
      flexDirection: isLandscape ? 'row' : 'column',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    questionStatsCard: {
      flex: 1,
      minWidth: isLandscape ? '45%' : '100%',
    }
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // تحميل إحصائيات الأسئلة
      const questionStats = {};
      questions.forEach(q => {
        const category = q.category;
        if (!questionStats[category]) {
          questionStats[category] = {
            total: 0,
            difficulties: {
              'سهل': 0,
              'متوسط': 0,
              'صعب': 0
            }
          };
        }
        questionStats[category].total++;
        questionStats[category].difficulties[q.difficulty]++;
      });
      setQuestionsStats(questionStats);

      // تحميل سجل الألعاب
      const history = await StorageService.getGameHistory();
      setGameHistory(history || []);

      // تحميل الإحصائيات العامة
      const generalStats = await StorageService.getStatistics();
      setStats(generalStats || {
        gamesPlayed: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalPoints: 0
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الإحصائيات');
    }
  };

  const GeneralStatsSection = () => (
    <View style={styles.generalStatsSection}>
      <View style={styles.section}>
        <GradientContainer
          colors={[theme.colors.primary, `${theme.colors.primary}CC`]}
          style={styles.header}
        >
          <Text style={styles.headerText}>الإحصائيات العامة</Text>
        </GradientContainer>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.categoryName}>عدد الألعاب</Text>
            <Text style={styles.teamScore}>{stats?.gamesPlayed || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.categoryName}>الأسئلة المجاب عنها</Text>
            <Text style={styles.teamScore}>{stats?.questionsAnswered || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.categoryName}>الإجابات الصحيحة</Text>
            <Text style={styles.teamScore}>{stats?.correctAnswers || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.categoryName}>مجموع النقاط</Text>
            <Text style={styles.teamScore}>{stats?.totalPoints || 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const QuestionsStatsSection = () => (
    <View style={styles.sideSection}>
      <View style={styles.section}>
        <GradientContainer
          colors={[theme.colors.primary, `${theme.colors.primary}CC`]}
          style={styles.header}
        >
          <Text style={styles.headerText}>إحصائيات الأسئلة</Text>
        </GradientContainer>
        <View style={styles.cardGrid}>
          {questionsStats && Object.entries(questionsStats).map(([category, data]) => (
            <View key={category} style={[styles.statsCard, styles.questionStatsCard]}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.totalQuestions}>
                {`إجمالي الأسئلة: ${data.total}`}
              </Text>
              <View style={styles.difficultyContainer}>
                {Object.entries(data.difficulties).map(([difficulty, count]) => (
                  <GradientContainer
                    key={difficulty}
                    colors={DIFFICULTY_COLORS[difficulty]}
                    style={styles.difficultyCard}
                  >
                    <Text style={styles.difficultyText}>{difficulty}</Text>
                    <Text style={styles.difficultyCount}>{count}</Text>
                  </GradientContainer>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const GameHistorySection = () => (
    <View style={styles.sideSection}>
      <View style={styles.section}>
        <GradientContainer
          colors={[theme.colors.primary, `${theme.colors.primary}CC`]}
          style={styles.header}
        >
          <Text style={styles.headerText}>سجل الألعاب</Text>
        </GradientContainer>
        <ScrollView style={{ maxHeight: isLandscape ? window.height * 0.7 : window.height * 0.4 }}>
          {gameHistory.length > 0 ? (
            gameHistory.map((game, index) => (
              <View key={index} style={styles.statsCard}>
                <Text style={styles.gameName}>
                  {`اللعبة ${gameHistory.length - index}`}
                </Text>
                <View style={styles.teamsContainer}>
                  {Object.entries(game.scores || {}).map(([team, score], idx) => (
                    <View key={team} style={styles.teamRow}>
                      <Text style={styles.teamName}>{team}</Text>
                      <Text style={styles.teamScore}>{score}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.categoriesContainer}>
                  <Text style={styles.sectionTitle}>الفئات المستخدمة:</Text>
                  <View style={styles.categoriesList}>
                    {game.categories?.map((category, idx) => (
                      <View key={idx} style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{category}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>لا يوجد سجل للألعاب السابقة</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );

  if (!stats || !questionsStats) {
    return (
      <BackgroundPattern>
        <SafeAreaView style={styles.container}>
          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons 
                name="arrow-back" 
                size={24} 
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.loadingText}>جاري تحميل الإحصائيات...</Text>
        </SafeAreaView>
      </BackgroundPattern>
    );
  }

  return (
    <BackgroundPattern>
      <SafeAreaView style={styles.container}>
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={isLandscape ? styles.landscapeContent : styles.portraitContent}
        >
          <GeneralStatsSection />
          <View style={{ flexDirection: isLandscape ? 'row' : 'column', gap: SPACING.md, width: '100%' }}>
            <QuestionsStatsSection />
            <GameHistorySection />
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundPattern>
  );
};

export default StatisticsScreen;