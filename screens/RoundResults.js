import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS, SHADOWS } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { MaterialIcons } from '@expo/vector-icons';
import ResponsiveView from '../components/ResponsiveView';
import { wp, hp } from '../styles/responsive';
import { StorageService } from '../services/storageService';
import { Alert } from 'react-native';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.h2,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    opacity: 0.8,
  },
  teamContainer: {
    marginBottom: SPACING.lg,
    borderRadius: 16,
    padding: SPACING.md,
    overflow: 'hidden',
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderRadius: 12,
    padding: SPACING.sm,
  },
  teamName: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.xl,
  },
  button: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },
});

const RoundResults = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const window = Dimensions.get('window');
  const isLandscape = window.width > window.height;
  
  const gameData = params.gameData ? JSON.parse(params.gameData) : null;
  const scores = gameData?.scores || {};
  const teams = gameData?.teams || [];
  const statistics = gameData?.statistics || {};
  const categories = gameData?.categories || [];

  const sortedTeams = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([team]) => team);

  const handleNewRound = async () => {
    try {
      // حذف بيانات اللعبة الحالية
      await StorageService.clearCurrentGame();
      
      // الانتقال إلى الشاشة الرئيسية
      router.push('/');
    } catch (error) {
      console.error('خطأ في بدء جولة جديدة:', error);
      Alert.alert('خطأ', 'حدث خطأ في بدء جولة جديدة');
    }
  };

  if (!gameData) {
    return (
      <BackgroundPattern
        style={{ flex: 1 }}
        patternId="resultsErrorPattern"
      >
        <ResponsiveView style={[staticStyles.container, { backgroundColor: 'transparent' }]}>
          <View style={[
            staticStyles.card,
            { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background.card,
              borderWidth: 1,
              shadowColor: theme.colors.text.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              borderRadius: 20,
            }
          ]}>
            <View style={staticStyles.header}>
              <View>
                <Text style={[staticStyles.title, { color: theme.colors.text.primary }]}>
                  خطأ في تحميل النتائج
                </Text>
                <Text style={[staticStyles.subtitle, { color: theme.colors.text.secondary }]}>
                  يرجى المحاولة مرة أخرى
                </Text>
              </View>
            </View>

            <View style={staticStyles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  staticStyles.button,
                  { backgroundColor: theme.colors.primary }
                ]}
                onPress={handleNewRound}
              >
                <Text style={[staticStyles.buttonText, { color: theme.colors.text.light }]}>
                  العودة للرئيسية
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ResponsiveView>
      </BackgroundPattern>
    );
  }

  const LandscapeLayout = () => (
    <View style={{ flexDirection: 'row', flex: 1, padding: SPACING.md }}>
      {/* العمود الأول: الفائز والنتائج */}
      <View style={{ flex: 1, marginRight: SPACING.md }}>
        <LinearGradient
          colors={[
            `${theme.colors.success}30`,
            `${theme.colors.success}20`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20 }]}
        >
          <MaterialIcons 
            name="emoji-events" 
            size={32} 
            color={theme.colors.success} 
            style={{ marginBottom: SPACING.xs }}
          />
          <Text style={[staticStyles.teamName, { fontSize: FONTS.sizes.h3 }]}>
            {`الفائز: ${sortedTeams[0]}`}
          </Text>
          <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
            {`${scores[sortedTeams[0]]} نقطة`}
          </Text>
        </LinearGradient>

        <View style={[staticStyles.teamContainer, { borderRadius: 20 }]}>
          {sortedTeams.map((team, index) => (
            <LinearGradient
              key={team}
              colors={[
                index === 0 ? `${theme.colors.success}15` : `${theme.colors.background.card}40`,
                `${theme.colors.background.card}10`
              ]}
              style={[staticStyles.teamHeader, { borderRadius: 16 }]}
            >
              <Text style={[staticStyles.teamName, { 
                color: index === 0 ? theme.colors.success : theme.colors.text.primary,
                fontSize: FONTS.sizes.body
              }]}>
                {`${index + 1}. ${team}`}
              </Text>
              <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
                {`${scores[team]}`}
              </Text>
            </LinearGradient>
          ))}
        </View>
      </View>

      {/* العمود الثاني: الإحصائيات */}
      <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
        <LinearGradient
          colors={[
            `${theme.colors.primary}25`,
            `${theme.colors.primary}15`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20 }]}
        >
          <Text style={[staticStyles.title, { fontSize: FONTS.sizes.h4 }]}>
            إحصائيات الجولة
          </Text>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="question-answer" 
              size={20} 
              color={theme.colors.primary}
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { fontSize: FONTS.sizes.small }]}>
              {`الأسئلة: ${statistics.answeredQuestions}/${statistics.totalQuestions}`}
            </Text>
          </View>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="star" 
              size={20} 
              color={theme.colors.primary}
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { fontSize: FONTS.sizes.small }]}>
              {`النقاط المضاعفة: ${statistics.doublePointsUsed}`}
            </Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          style={[
            staticStyles.button,
            { 
              backgroundColor: theme.colors.primary,
              marginTop: SPACING.md,
              borderRadius: 12,
            }
          ]}
          onPress={handleNewRound}
        >
          <MaterialIcons name="refresh" size={20} color={theme.colors.text.onPrimary} />
          <Text style={[staticStyles.buttonText, { 
            color: theme.colors.text.onPrimary,
            fontSize: FONTS.sizes.body
          }]}>
            جولة جديدة
          </Text>
        </TouchableOpacity>
      </View>

      {/* العمود الثالث: إحصائيات الفئات */}
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <LinearGradient
          colors={[
            `${theme.colors.secondary}25`,
            `${theme.colors.secondary}15`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20 }]}
        >
          <Text style={[staticStyles.title, { fontSize: FONTS.sizes.h4 }]}>
            إحصائيات الفئات
          </Text>
          <ScrollView style={{ maxHeight: window.height * 0.6 }}>
            {Object.entries(statistics.categoryStats || {}).map(([category, stats]) => (
              <View key={category} style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
                <Text style={[staticStyles.teamName, { 
                  color: theme.colors.text.primary,
                  fontSize: FONTS.sizes.small
                }]}>
                  {category}
                </Text>
                <Text style={[staticStyles.scoreText, { 
                  color: theme.colors.text.secondary,
                  fontSize: FONTS.sizes.small
                }]}>
                  {`${stats.answered}/${stats.total}`}
                </Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );

  const PortraitLayout = () => (
    <ScrollView 
      style={staticStyles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[
        staticStyles.card,
        { 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background.card,
          borderWidth: 1,
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          borderRadius: 20,
        }
      ]}>
        <View style={staticStyles.header}>
          <View>
            <Text style={[staticStyles.title, { color: theme.colors.text.primary }]}>
              نتائج الجولة
            </Text>
            <Text style={[staticStyles.subtitle, { color: theme.colors.text.secondary }]}>
              {gameData?.roundName || 'الجولة الحالية'}
            </Text>
          </View>
        </View>

        {/* عرض الفائز */}
        <LinearGradient
          colors={[
            `${theme.colors.success}30`,
            `${theme.colors.success}20`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20 }]}
        >
          <MaterialIcons 
            name="emoji-events" 
            size={40} 
            color={theme.colors.success} 
            style={{ marginBottom: SPACING.sm }}
          />
          <Text style={[staticStyles.teamName, { color: theme.colors.success }]}>
            {`الفائز: ${sortedTeams[0]}`}
          </Text>
          <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
            {`${scores[sortedTeams[0]]} نقطة`}
          </Text>
        </LinearGradient>

        {/* عرض نتائج جميع الفرق */}
        <View style={[staticStyles.teamContainer, { borderRadius: 20 }]}>
          {sortedTeams.map((team, index) => (
            <LinearGradient
              key={team}
              colors={[
                index === 0 ? `${theme.colors.success}15` : `${theme.colors.background.card}40`,
                `${theme.colors.background.card}10`
              ]}
              style={[staticStyles.teamHeader, { borderRadius: 16 }]}
            >
              <Text style={[staticStyles.teamName, { 
                color: index === 0 ? theme.colors.success : theme.colors.text.primary 
              }]}>
                {`${index + 1}. ${team}`}
              </Text>
              <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
                {`${scores[team]} نقطة`}
              </Text>
            </LinearGradient>
          ))}
        </View>

        {/* عرض الإحصائيات */}
        <LinearGradient
          colors={[
            `${theme.colors.primary}25`,
            `${theme.colors.primary}15`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20 }]}
        >
          <Text style={[staticStyles.title, { color: theme.colors.text.primary }]}>
            إحصائيات الجولة
          </Text>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="question-answer" 
              size={24} 
              color={theme.colors.primary}
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
              {`الأسئلة المجاب عنها: ${statistics.answeredQuestions} من ${statistics.totalQuestions}`}
            </Text>
          </View>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="star" 
              size={24} 
              color={theme.colors.primary}
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
              {`النقاط المضاعفة المستخدمة: ${statistics.doublePointsUsed}`}
            </Text>
          </View>
        </LinearGradient>

        {/* عرض إحصائيات الفئات */}
        <LinearGradient
          colors={[
            `${theme.colors.secondary}25`,
            `${theme.colors.secondary}15`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20 }]}
        >
          <Text style={[staticStyles.title, { color: theme.colors.text.primary }]}>
            إحصائيات الفئات
          </Text>
          {Object.entries(statistics.categoryStats || {}).map(([category, stats]) => (
            <View key={category} style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
              <Text style={[staticStyles.teamName, { color: theme.colors.text.primary }]}>
                {category}
              </Text>
              <Text style={[staticStyles.scoreText, { color: theme.colors.text.secondary }]}>
                {`${stats.answered}/${stats.total}`}
              </Text>
            </View>
          ))}
        </LinearGradient>

        {/* زر جولة جديدة */}
        <View style={staticStyles.buttonsContainer}>
          <TouchableOpacity
            style={[
              staticStyles.button,
              { 
                backgroundColor: theme.colors.primary,
                borderRadius: 12,
              }
            ]}
            onPress={handleNewRound}
          >
            <MaterialIcons name="refresh" size={24} color={theme.colors.text.onPrimary} />
            <Text style={[staticStyles.buttonText, { color: theme.colors.text.onPrimary }]}>
              جولة جديدة
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <BackgroundPattern
      style={{ flex: 1 }}
      patternId="resultsPattern"
    >
      <ResponsiveView style={[staticStyles.container, { backgroundColor: 'transparent' }]}>
        {isLandscape ? <LandscapeLayout /> : <PortraitLayout />}
      </ResponsiveView>
    </BackgroundPattern>
  );
};

export default RoundResults;