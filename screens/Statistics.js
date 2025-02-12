import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { SPACING } from '../constants/Spacing';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chartContainer: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    backgroundColor: 'transparent',
  },
});

const Statistics = () => {
  const router = useRouter();
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    ...staticStyles,
    container: {
      ...staticStyles.container,
      backgroundColor: theme.colors.background.primary,
    },
    chartContainer: {
      ...staticStyles.chartContainer,
      backgroundColor: theme.colors.background.card,
    },
  });

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Chart
        data={gameHistory}
        type="line"
        options={{
          responsive: true,
          title: 'تطور النقاط',
          scales: {
            y: { beginAtZero: true }
          }
        }}
      />
      <TeamPerformance data={teamStats} />
      <CategoryAnalysis data={categoryStats} />
    </View>
  );
}; 