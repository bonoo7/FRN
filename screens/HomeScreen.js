import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Animated,
  Switch,
  Alert,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS, SHADOWS } from '../styles/theme';
import { useTheme, getTheme } from '../contexts/ThemeContext';
import { StorageService } from '../services/storageService';
import RewardsGuide from '../components/RewardsGuide';
import { MaterialIcons } from '@expo/vector-icons';
import ResponsiveView from '../components/ResponsiveView';
import { ThemeSelector } from '../components/ThemeSelector';
import { 
  wp, 
  hp, 
  getResponsiveStyles, 
  breakpoints
} from '../styles/responsive';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { useRouter, Link, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// تعريف الثوابت خارج المكون
const TEAM_NUMBERS = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
const MIN_TEAMS = 2;
const MAX_TEAMS = 5;

// تعريف الأنماط الثابتة فقط
const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  header: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: wp(6),
    fontWeight: FONTS.weights.bold,
    marginBottom: getResponsiveStyles().margin,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp(3.5),
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: wp(5),
  },
  row: {
    flexDirection: 'row-reverse',
    marginBottom: getResponsiveStyles().isSmallScreen ? SPACING.sm : SPACING.lg,
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xs,
    textAlign: 'right',
  },
  teamCountContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  teamCountButton: {
    flex: 1,
    paddingVertical: getResponsiveStyles().isSmallScreen ? SPACING.sm : SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCountText: {
    fontSize: getResponsiveStyles().isSmallScreen ? FONTS.sizes.h4 : FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  teamsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: getResponsiveStyles().margin,
    marginBottom: getResponsiveStyles().margin * 2,
  },
  teamInputContainer: {
    width: getResponsiveStyles().isSmallScreen ? '100%' : '48%',
    marginBottom: SPACING.md,
  },
  input: {
    borderRadius: 12,
    padding: getResponsiveStyles().isSmallScreen ? SPACING.sm : SPACING.md,
    fontSize: FONTS.sizes.body,
    textAlign: 'right',
    borderWidth: 1,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  startButtonContent: {
    padding: getResponsiveStyles().isSmallScreen ? SPACING.md : SPACING.lg,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: getResponsiveStyles().isSmallScreen ? FONTS.sizes.h3 : FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  settingsCard: {
    width: '100%',
    marginTop: getResponsiveStyles().isSmallScreen ? SPACING.xl : SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.medium,
    textAlign: 'right',
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  switchLabel: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    marginRight: SPACING.md,
  },
  switchStyle: {
    transform: Platform.select({
      ios: [
        { scaleX: 1 },
        { scaleY: 1 },
      ],
      android: [
        { scaleX: 1 },
        { scaleY: 1 },
      ],
      default: [
        { scaleX: 1 },
        { scaleY: 1 },
      ],
    }),
    marginVertical: 4,
  },
  switchTrackColor: {
    false: Platform.select({
      ios: '#E0E0E0',
      android: 'rgba(0,0,0,0.1)',
      default: '#E0E0E0',
    }),
    true: Platform.select({
      ios: '#4361EE',
      android: 'rgba(67, 97, 238, 0.5)',
      default: '#4361EE',
    }),
  },
  hint: {
    fontSize: FONTS.sizes.body,
    color: '#666666',
    marginTop: SPACING.xs,
  },
  headerButton: {
    padding: SPACING.sm,
    borderRadius: 8,
    backgroundColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rewardsSectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  rewardsSectionTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    marginRight: SPACING.sm,
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  rewardsGuideText: {
    fontSize: FONTS.sizes.sm,
    textDecorationLine: 'underline',
  },
  rewardsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  rewardsSection: {
    borderRadius: 12,
    padding: SPACING.sm,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xl,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  formContainer: {
    width: '100%',
    maxWidth: wp(80),
    alignSelf: 'center',
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  tooltip: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tooltipText: {
    fontSize: FONTS.sizes.body,
    color: '#333',
  },
  card: {
    width: '100%',
    maxWidth: wp(80),
    alignSelf: 'center',
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  rewardsCard: {
    padding: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  rewardsContainer: {
    width: '100%',
    maxWidth: wp(80),
    alignSelf: 'center',
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

const RewardsSection = ({ rewardsEnabled, onToggle, onShowGuide, theme, styles }) => {
  return (
    <View style={styles.rewardsSectionContent}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.rewardsSectionTitle, { color: theme.colors.text.primary }]}>
          نظام المكافئات
        </Text>
        <Switch
          value={rewardsEnabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
          thumbColor={rewardsEnabled ? theme.colors.text.light : theme.colors.text.primary}
        />
      </View>
      <TouchableOpacity
        onPress={onShowGuide}
        style={[
          styles.helpButton,
          { backgroundColor: theme.colors.primary }
        ]}
      >
        <MaterialIcons 
          name="help" 
          size={16} 
          color={theme.colors.text.light}
        />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [isSmallScreen, setIsSmallScreen] = useState(screenWidth < breakpoints.tablet);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [showRewardsGuide, setShowRewardsGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [patternKey, setPatternKey] = useState(Date.now());

  if (!theme) {
    return null;
  }

  // تحديث الأنيميشن والنمط عند التركيز على الشاشة
  useFocusEffect(
    React.useCallback(() => {
      // إعادة تشغيل الأنيميشن
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // إعادة تحميل النمط
      setPatternKey(Date.now());

      return () => {
        // تنظيف عند مغادرة الشاشة
        fadeAnim.setValue(0);
      };
    }, [])
  );

  const [roundCount, setRoundCount] = useState(1);

  useEffect(() => {
    const loadRoundCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('roundCount');
        if (savedCount) {
          setRoundCount(parseInt(savedCount));
        }
      } catch (error) {
        console.error('خطأ في تحميل رقم الجولة:', error);
      }
    };
    loadRoundCount();
  }, []);

  const getDefaultRoundName = () => {
    const numbers = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
    return `الجولة ${numbers[roundCount - 1] || roundCount}`;
  };

  const getDefaultTeamName = (index) => {
    return `الفريق ${index + 1}`;
  };

  // تجميع كل ال states في مكان واحد
  const [gameSettings, setGameSettings] = useState({
    roundName: '',
    teamCount: MIN_TEAMS,
    teams: Array(MIN_TEAMS).fill(''),
    rewardsEnabled: true
  });

  const updateTeamCount = (count) => {
    setGameSettings(prev => ({ ...prev, teamCount: count, teams: Array(count).fill('') }));
  };

  const updateTeam = (index, value) => {
    const newTeams = [...gameSettings.teams];
    newTeams[index] = value;
    setGameSettings(prev => ({ ...prev, teams: newTeams }));
  };

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await AsyncStorage.getItem('settings');
      const parsedSettings = settings ? JSON.parse(settings) : { rewardsEnabled: true };
      setRewardsEnabled(parsedSettings.rewardsEnabled);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      if (Math.abs(window.width - screenWidth) > 50) {  // تجنب التحديثات الصغيرة
        setScreenWidth(window.width);
        setIsSmallScreen(window.width < breakpoints.tablet);
      }
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    return () => subscription.remove();
  }, [screenWidth]);

  useEffect(() => {
    const hasUnsavedData = gameSettings.teams.some(team => team.trim()) || gameSettings.roundName.trim();
    
    if (hasUnsavedData) {
      const handleBackPress = () => {
        Alert.alert(
          'تأكيد الخروج',
          'هل أنت متأكد من الخروج؟ ستفقد البيانات المدخلة',
          [
            { text: 'إلغاء', style: 'cancel' },
            { 
              text: 'خروج', 
              style: 'destructive', 
              onPress: () => router.back() 
            }
          ]
        );
        return true;
      };
      
      if (Platform.OS !== 'web') {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }
  }, [gameSettings.teams, gameSettings.roundName]);

  const handleRewardsToggle = async (value) => {
    setRewardsEnabled(value);
    await AsyncStorage.setItem('settings', JSON.stringify({ rewardsEnabled: value }));
  };

  const validateGameSettings = (settings) => {
    // التحقق من طول اسم الفريق
    if (settings.teams.some(team => team.trim().length > 0 && team.trim().length < 2)) {
      throw new Error('اسم الفريق يجب أن يكون حرفين على الأقل');
    }
    if (settings.teams.some(team => team.length > 20)) {
      throw new Error('اسم الفريق يجب أن لا يتجاوز 20 حرف');
    }
    // التحقق من الأحرف الخاصة
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    if (settings.teams.some(team => specialCharsRegex.test(team))) {
      throw new Error('اسم الفريق يجب أن لا يحتوي على رموز خاصة');
    }
    if (new Set(settings.teams.filter(Boolean)).size !== settings.teams.filter(Boolean).length) {
      throw new Error('لا يمكن تكرار أسماء الفرق');
    }
  };

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      validateGameSettings(gameSettings);
      
      const finalRoundName = gameSettings.roundName.trim() || getDefaultRoundName();
      const finalTeams = gameSettings.teams
        .map((team, index) => team.trim() || getDefaultTeamName(index))
        .filter(team => team);

      const initialGameData = {
        roundName: finalRoundName,
        teams: finalTeams,
        categories: [],
        questions: {},
        scores: finalTeams.reduce((acc, team) => ({
          ...acc,
          [team]: 0
        }), {}),
        currentTeamIndex: 0,
        usedDoublePoints: finalTeams.reduce((acc, team) => ({
          ...acc,
          [team]: false
        }), {}),
        timestamp: new Date().toISOString(),
        rewardsEnabled
      };

      await StorageService.saveCurrentGame(initialGameData);
      router.push('/game/setup');
    } catch (error) {
      console.error('خطأ في حفظ بيانات اللعبة:', error);
      Alert.alert('خطأ', error.message || 'حدث خطأ في حفظ بيانات اللعبة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatistics = () => {
    router.push('/statistics');
  };

  const responsiveStyles = getResponsiveStyles();

  const getTeamInputWidth = () => {
    if (screenWidth >= breakpoints.tablet) {
      return wp(30);
    }
    return wp(45);
  };

  const switchTransform = [{ scaleX: -1 }, { scaleY: 1 }];

  const switchThumbColorByPlatform = Platform.select({
    ios: '#FFFFFF',
    android: rewardsEnabled ? theme.colors.text.light : '#f4f3f4',
    default: '#FFFFFF',
  });

  // إنشاء الأنماط باستخدام getTheme مباشرة
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    backgroundPattern: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: SPACING.md,
    },
    ...staticStyles,
    header: {
      ...staticStyles.header,
      backgroundColor: theme.colors.gradient.primary[0],
    },
    headerButton: {
      ...staticStyles.headerButton,
      backgroundColor: theme.colors.background.card,
    },
    rewardsSection: {
      ...staticStyles.rewardsSection,
      backgroundColor: `${theme.colors.background.card}80`,
    },
    formContainer: {
      ...staticStyles.formContainer,
      backgroundColor: `${theme.colors.background.card}80`,
    },
    teamCountContainer: {
      ...staticStyles.teamCountContainer,
      backgroundColor: theme.colors.background.surface,
    },
    input: {
      ...staticStyles.input,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background.surface,
    },
    startButtonText: {
      ...staticStyles.startButtonText,
      color: theme.colors.text.light,
    },
    switchLabel: {
      ...staticStyles.switchLabel,
      color: theme.colors.text.primary,
    },
    switchTrackColor: {
      false: Platform.select({
        ios: theme.colors.disabled,
        android: 'rgba(0,0,0,0.1)',
        default: theme.colors.disabled,
      }),
      true: Platform.select({
        ios: theme.colors.primary,
        android: `${theme.colors.primary}50`,
        default: theme.colors.primary,
      }),
    },
  });

  return (
    <BackgroundPattern
      key={patternKey}
      style={{ flex: 1 }}
      patternId={`homeScreenPattern-${patternKey}`}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <View style={{ marginLeft: SPACING.md }}>
              <ThemeSelector />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={[staticStyles.headerButton, { marginRight: SPACING.md }]}
              onPress={handleStatistics}
            >
              <MaterialIcons 
                name="insert-chart" 
                size={24} 
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          )
        }}
      />
      <ResponsiveView style={[staticStyles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView
          style={[staticStyles.content, { backgroundColor: 'transparent' }]}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <View style={[staticStyles.header, { backgroundColor: 'transparent' }]}>
              <Text style={[staticStyles.title, { color: theme.colors.text.primary }]}>
                فرندز
              </Text>
              <Text style={[staticStyles.subtitle, { color: theme.colors.text.secondary }]}>
                لعبة تحدي وتنافس
              </Text>
            </View>

            <View style={[
              staticStyles.card,
              {
                backgroundColor: `${theme.colors.background.card}95`,
                borderColor: theme.colors.border,
                elevation: 4,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                marginBottom: SPACING.xl
              }
            ]}>
              <View style={staticStyles.row}>
                <View style={[staticStyles.inputContainer, { marginLeft: 0, marginRight: SPACING.xl }]}>
                  <Text style={[staticStyles.label, { color: theme.colors.text.primary }]}>عدد الفرق</Text>
                  <View style={[staticStyles.teamCountContainer, { backgroundColor: theme.colors.background.surface }]}>
                    {[2, 3, 4, 5].map(count => (
                      <TouchableOpacity
                        key={count}
                        style={[
                          staticStyles.teamCountButton,
                          gameSettings.teamCount === count && { 
                            backgroundColor: theme.colors.primary,
                            transform: [{ scale: 1.05 }]
                          }
                        ]}
                        onPress={() => updateTeamCount(count)}
                      >
                        <Text style={[
                          staticStyles.teamCountText,
                          { color: gameSettings.teamCount === count ? theme.colors.text.light : theme.colors.text.primary }
                        ]}>
                          {count}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={[staticStyles.inputContainer, { marginRight: SPACING.xl }]}>
                  <Text style={[staticStyles.label, { color: theme.colors.text.primary }]}>اسم الجولة</Text>
                  <TextInput
                    style={[staticStyles.input, { 
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.surface,
                      borderColor: theme.colors.border,
                    }]}
                    value={gameSettings.roundName}
                    onChangeText={(value) => setGameSettings(prev => ({ ...prev, roundName: value }))}
                    placeholder={showHints ? "مثال: الجولة الأولى" : ""}
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
              </View>

              <View style={staticStyles.teamsGrid}>
                {Array.from({ length: gameSettings.teamCount }).map((_, index) => (
                  <View key={index} style={staticStyles.teamInputContainer}>
                    <Text style={[staticStyles.label, { color: theme.colors.text.primary }]}>
                      {`الفريق ${index + 1}`}
                    </Text>
                    <TextInput
                      style={[staticStyles.input, { 
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.surface,
                        borderColor: theme.colors.border,
                      }]}
                      value={gameSettings.teams[index]}
                      onChangeText={(value) => updateTeam(index, value)}
                      placeholder={getDefaultTeamName(index)}
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  staticStyles.startButton,
                  isLoading && staticStyles.startButtonDisabled
                ]}
                onPress={handleStartGame}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.text.light} />
                ) : (
                  <LinearGradient
                    colors={theme.colors.gradient.primary}
                    style={staticStyles.startButtonContent}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={[staticStyles.startButtonText, { color: theme.colors.text.light }]}>
                      بدء اللعبة
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>

              <View style={{ marginTop: SPACING.xl, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                <RewardsSection
                  rewardsEnabled={rewardsEnabled}
                  onToggle={handleRewardsToggle}
                  onShowGuide={() => setShowRewardsGuide(true)}
                  theme={theme}
                  styles={staticStyles}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </ResponsiveView>
      {showRewardsGuide && (
        <RewardsGuide
          visible={showRewardsGuide}
          onClose={() => setShowRewardsGuide(false)}
        />
      )}
    </BackgroundPattern>
  );
};

export default HomeScreen; 