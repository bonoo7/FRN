import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { useTheme, getTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: '#fff',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  infoText: {
    fontSize: FONTS.sizes.body,
    marginBottom: SPACING.xs,
  },
  resultsContainer: {
    flex: 1,
    gap: SPACING.sm,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  winnerCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rankText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  teamName: {
    flex: 1,
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  scoreText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.medium,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  button: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
  },
  loadingText: {
    fontSize: FONTS.sizes.h3,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: theme.colors.text.primary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.body,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    color: theme.colors.text.primary,
  },
});

const GameResults = ({ route }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  console.log('تم استلام المعاملات:', params);

  const [gameData, setGameData] = useState(null);

  // تحميل بيانات اللعبة
  useEffect(() => {
    console.log('params received:', params);
    if (params.gameData) {
      try {
        const parsedData = JSON.parse(params.gameData);
        console.log('تم تحليل البيانات:', parsedData);
        
        // التحقق من البيانات المستلمة
        if (typeof parsedData !== 'object') {
          throw new Error('صيغة البيانات غير صحيحة');
        }

        const requiredFields = ['roundName', 'teams', 'scores', 'categories', 'statistics', 'winner'];
        const missingFields = requiredFields.filter(field => !parsedData[field]);
        
        if (missingFields.length > 0) {
          console.log('الحقول المفقودة:', missingFields);
          throw new Error(`البيانات غير مكتملة: ${missingFields.join(', ')}`);
        }

        // التحقق من صحة تنسيق البيانات
        if (!Array.isArray(parsedData.teams)) {
          throw new Error('صيغة الفرق غير صحيحة');
        }
        if (typeof parsedData.scores !== 'object') {
          throw new Error('صيغة النقاط غير صحيحة');
        }

        // التحقق من تطابق عدد الفرق مع النقاط
        if (parsedData.teams.length !== Object.keys(parsedData.scores).length) {
          console.log('عدم تطابق:', {
            teamsCount: parsedData.teams.length,
            scoresCount: Object.keys(parsedData.scores).length
          });
          throw new Error('عدد الفرق لا يتطابق مع النقاط المسجلة');
        }

        // تنظيف وتنسيق البيانات قبل الحفظ
        const cleanData = {
          roundName: parsedData.roundName,
          teams: parsedData.teams,
          scores: parsedData.scores,
          categories: parsedData.categories,
          statistics: parsedData.statistics,
          winner: parsedData.winner
        };

        setGameData(cleanData);
        console.log('تم تحديث gameData:', cleanData);
      } catch (error) {
        console.error('خطأ في تحليل البيانات:', error);
        Alert.alert(
          'خطأ',
          'حدث خطأ في تحميل نتائج اللعبة: ' + error.message,
          [{ text: 'حسناً', onPress: () => router.replace('/') }]
        );
      }
    }
  }, [params.gameData]);

  // إضافة تتبع للبيانات عند تغيرها
  useEffect(() => {
    if (gameData) {
      console.log('تم تحديث gameData:', {
        roundName: gameData.roundName,
        teamsCount: gameData.teams?.length,
        scores: gameData.scores,
        categories: gameData.categories?.length
      });
    }
  }, [gameData]);

  // ترتيب الفرق حسب النقاط (بدون useMemo)
  const sortedTeams = gameData?.scores
    ? Object.entries(gameData.scores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([team, score]) => ({ team, score }))
    : [];

  // تعريف sections
  const sections = [
    {
      title: 'نتائج الفرق',
      data: [
        // ... بيانات النتائج
      ]
    },
    {
      title: 'إحصائيات الأسئلة',
      data: [
        // ... بيانات الإحصائيات
      ]
    }
  ];

  // شاشة التحميل
  if (!gameData) {
    return (
      <BackgroundPattern>
        <View style={staticStyles.container}>
          <Text style={staticStyles.loadingText}>جاري تحميل النتائج...</Text>
        </View>
      </BackgroundPattern>
    );
  }

  const styles = StyleSheet.create({
    ...staticStyles,
    container: {
      ...staticStyles.container,
      backgroundColor: theme.colors.background.primary,
    },
  });

  return (
    <BackgroundPattern>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>نتائج اللعبة</Text>
        
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.card}>
                {Object.entries(item).map(([key, value], entryIndex) => (
                  <View key={entryIndex} style={styles.row}>
                    <Text style={styles.label}>{key}</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </BackgroundPattern>
  );
};

export default GameResults;
