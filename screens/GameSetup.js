import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS, SHADOWS } from '../styles/theme';
import { useTheme, getTheme } from '../contexts/ThemeContext';
import categoryImages from '../assets/categories';
import { globalStyles, withThemeStyles } from '../styles/styles';
import { StorageService } from '../services/storageService';
import { getResponsiveStyles, wp } from '../styles/responsive';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { BackgroundPattern } from '../components/BackgroundPattern';
import Animated, { 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { CategoryCard } from '../components/CategoryCard';
import { GameService } from '../services/gameService';

const staticStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: 'transparent',
  },
  gridContainer: {
    gap: SPACING.sm,
    padding: SPACING.md,
    paddingBottom: 100,
  },
  categoriesContainer: {
    flex: 1,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.sm,
  },
  categoryItem: {
    margin: 2,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
    borderTopWidth: 1,
    height: 60,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  progressWrapper: {
    flex: 1,
    marginRight: SPACING.md,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium,
  },
  startButton: {
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 100,
  },
  startButtonContent: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: FONTS.sizes.button,
    fontWeight: FONTS.weights.bold,
    color: '#FFFFFF',
  },
  teamInfo: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium,
    color: '#666',
  },
});

const GameSetup = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [gameData, setGameData] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [history, setHistory] = useState([]);

  const responsiveStyles = getResponsiveStyles();

  const getMaxCategories = (teamCount) => {
    console.log('Calculating categories for team count:', teamCount);
    switch (teamCount) {
      case 2:
        return 6;  // 3 فئات لكل فريق = 6
      case 3:
        return 6;  // 2 فئات لكل فريق = 6
      case 4:
        return 8;  // 2 فئات لكل فريق = 8
      case 5:
        return 10; // 2 فئات لكل فريق = 10
      default:
        console.warn('عدد فرق غير معروف:', teamCount);
        return 6;
    }
  };

  const getCategoriesPerTeam = () => {
    const maxCategories = getMaxCategories(gameData.teams.length);
    const categoriesPerTeam = Math.floor(maxCategories / gameData.teams.length);
    return categoriesPerTeam;
  };

  const getProgressBarWidth = () => {
    const maxCategories = getMaxCategories(gameData.teams.length);
    return (selectedCategories.length / maxCategories) * 100;
  };

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const data = await StorageService.getCurrentGame();
        if (data) {
          console.log('Loaded game data:', {
            teams: data.teams,
            teamCount: data.teams.length,
            maxCategories: getMaxCategories(data.teams.length)
          });
          setGameData(data);
          // حساب عدد الفئات المطلوبة بناءً على عدد الفرق
          console.log('Calculated maxCategories:', getMaxCategories(data.teams.length));
        } else {
          console.error('No game data found');
          Alert.alert('خطأ', 'لم يتم العثور على بيانات اللعبة');
          router.back();
        }
      } catch (error) {
        console.error('Error loading game data:', error);
        Alert.alert('خطأ', 'حدث خطأ في تحميل بيانات اللعبة');
        router.back();
      }
    };
    
    loadGameData();
  }, []);

  // تنظيم الفئات في مجموعات
  const categoryGroups = {
    'معارف دينية': ['إسلامي', 'قرآن', 'الرسول والصحابة', 'غزوات وفتوحات', 'ديانات'],
    'علوم وطبيعة': ['فيزياء', 'كيمياء', 'فلك', 'نباتات', 'علوم', 'حيوانات'],
    'معارف عامة': ['معلومات عامة', 'اختراعات', 'مكتشفون', 'أوائل', 'تكنولوجيا', 'جوائز'],
    'تاريخ وجغرافيا': ['تاريخ', 'جغرافيا', 'حضارات', 'دول ومعالم', 'عواصم', 'معارك وحروب', 'أمراء وحكام'],
    'فنون وأدب': ['فنون', 'شعر وأدب', 'من القائل', 'لغات ولهجات'],
    'رياضة': ['رياضة', 'كرة قدم'],
    'متنوعات': ['عملات', 'معاني', 'ألقاب', 'شخصيات', 'فلسفة']
  };

  // تجميع كل الفئات في مصفوفة واحدة
  const categories = Object.values(categoryGroups).reduce((acc, curr) => [...acc, ...curr], []);

  const checkCategoryAvailability = async (category) => {
    try {
      const availability = await StorageService.checkCategoryAvailability(category);
      
      // التحقق من وجود أسئلة كافية لكل مستوى صعوبة
      if (availability.byDifficulty) {
        const minQuestionsNeeded = 2; // الحد الأدنى المطلوب لكل مستوى
        const difficulties = ['سهل', 'متوسط', 'صعب'];
        
        for (const difficulty of difficulties) {
          if ((availability.byDifficulty[difficulty] || 0) < minQuestionsNeeded) {
            Alert.alert(
              'تنبيه',
              `لا توجد أسئلة كافية في فئة "${category}" للمستوى ${difficulty}\nالحد الأدنى المطلوب: ${minQuestionsNeeded} أسئلة`,
              [{ text: 'حسناً', style: 'default' }]
            );
            return false;
          }
        }
      }
      
      if (availability.availableQuestions === 0) {
        Alert.alert(
          'تنبيه',
          `لا توجد أسئلة متوفرة في فئة "${category}"`,
          [{ text: 'حسناً', style: 'default' }]
        );
        return false;  // منع اختيار الفئة
      }
      
      if (availability.needsNewCycle) {
        Alert.alert(
          'تنبيه',
          `تم استخدام جميع أسئلة فئة "${category}" في هذه الدورة. سيتم بدء دورة جديدة.`,
          [{ text: 'حسناً', style: 'default' }]
        );
      } else if (availability.availableQuestions < 9) { // زيادة الحد الأدنى المطلوب
        Alert.alert(
          'تحذير',
          `باقي ${availability.availableQuestions} أسئلة فقط في فئة "${category}"\nقد لا تكون كافية لجميع المستويات`,
          [{ text: 'حسناً', style: 'default' }]
        );
        return false; // منع اختيار الفئة إذا كان عدد الأسئلة غير كافٍ
      }
      return true;  // السماح باختيار الفئة
    } catch (error) {
      console.error('خطأ في فحص توفر الأسئلة:', error);
      Alert.alert(
        'خطأ',
        'حدث خطأ أثناء فحص توفر الأسئلة',
        [{ text: 'حسناً', style: 'default' }]
      );
      return false;  // منع اختيار الفئة في حالة الخطأ
    }
  };

  const toggleCategory = async (category) => {
    console.log('Current selected categories:', selectedCategories.length);
    console.log('Max categories allowed:', getMaxCategories(gameData.teams.length));
    console.log('Teams count:', gameData.teams.length);

    setHistory(prev => [...prev, selectedCategories]);
    setSelectedCategories(prev => {
      const index = prev.indexOf(category);
      if (index > -1) {
        const newOrder = { ...selectedOrder };
        delete newOrder[category];
        setSelectedOrder(newOrder);
        return prev.filter(cat => cat !== category);
      } else if (prev.length < getMaxCategories(gameData.teams.length)) {
        setSelectedOrder(prev => ({
          ...prev,
          [category]: Object.keys(prev).length + 1
        }));
        return [...prev, category];
      }
      return prev;
    });
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setSelectedCategories(prevState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleStart = async () => {
    if (selectedCategories.length === getMaxCategories(gameData.teams.length)) {
      try {
        // استخدام GameService لتهيئة اللعبة
        const updatedGameData = await GameService.gameState.initialize({
          ...gameData,
          categories: selectedCategories
        });

        await StorageService.saveCurrentGame(updatedGameData);
        router.push('/game');
      } catch (error) {
        console.error('خطأ في تهيئة الجولة:', error);
        Alert.alert('خطأ', 'حدث خطأ في تهيئة الجولة');
      }
    } else {
      Alert.alert('تنبيه', `الرجاء اختيار ${getMaxCategories(gameData.teams.length)} فئات`);
    }
  };

  const handleLongPress = (category) => {
    Alert.alert(
      category,
      'هل تريد معرفة المزيد عن هذه الفئة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'عرض التفاصيل', 
          onPress: () => showCategoryDetails(category)
        }
      ]
    );
  };

  const showCategoryDetails = async (category) => {
    const availability = await StorageService.checkCategoryAvailability(category);
    Alert.alert(
      category,
      `عدد الأسئلة المتاحة: ${availability.availableQuestions}\nمستويات الصعوبة: سهل، متوسط، صعب`
    );
  };

  // إضافة فحص لوجود البيانات
  if (!gameData) {
    return (
      <BackgroundPattern>
        <View style={staticStyles.loadingContainer}>
          <Text>جاري تحميل البيانات...</Text>
        </View>
      </BackgroundPattern>
    );
  }

  return (
    <BackgroundPattern
      style={{ backgroundColor: theme.colors.background.primary }}
      patternId="gameSetupPattern"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={staticStyles.container}>
        <ScrollView 
          contentContainerStyle={staticStyles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            staticStyles.categoriesContainer,
            { 
              backgroundColor: `${theme.colors.background.card}80`,
              borderColor: theme.colors.border,
              shadowOpacity: theme.currentTheme === 'dark' ? 0.3 : 0.1,
            }
          ]}>
            <View style={staticStyles.categoriesGrid}>
              {categories.map((category) => (
                <View key={category} style={staticStyles.categoryItem}>
                  <CategoryCard
                    key={category}
                    category={category}
                    isSelected={selectedCategories.includes(category)}
                    order={selectedOrder[category]}
                    onPress={async () => {
                      const isAvailable = await checkCategoryAvailability(category);
                      if (isAvailable) {
                        toggleCategory(category);
                      }
                    }}
                    onLongPress={() => handleLongPress(category)}
                    theme={theme}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[
          staticStyles.progressContainer,
          { 
            backgroundColor: `${theme.colors.background.surface}E6`,
            borderTopColor: theme.colors.border,
          }
        ]}>
          <View style={staticStyles.progressContent}>
            <View style={staticStyles.progressWrapper}>
              <View style={staticStyles.progressBarContainer}>
                <LinearGradient
                  colors={theme.colors.gradient.primary}
                  style={[
                    staticStyles.progressBar,
                    { width: `${getProgressBarWidth()}%` }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <View style={staticStyles.progressDetails}>
                <Text style={[
                  staticStyles.progressText,
                  { color: theme.colors.text.secondary }
                ]}>
                  {`${selectedCategories.length} من ${getMaxCategories(gameData.teams.length)} فئة`}
                </Text>
                <Text style={[
                  staticStyles.teamInfo,
                  { color: theme.colors.text.secondary }
                ]}>
                  {`${getCategoriesPerTeam()} فئات لكل فريق`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                staticStyles.startButton,
                { opacity: selectedCategories.length < getMaxCategories(gameData.teams.length) ? 0.5 : 1 }
              ]}
              onPress={handleStart}
              disabled={selectedCategories.length < getMaxCategories(gameData.teams.length)}
            >
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={staticStyles.startButtonContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={staticStyles.startButtonText}>
                  بدء اللعب
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BackgroundPattern>
  );
};

export default GameSetup;