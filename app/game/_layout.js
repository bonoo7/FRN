import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { BackgroundPattern } from '../../components/BackgroundPattern';

export default function GameLayout() {
  const { theme } = useTheme();

  return (
    <BackgroundPattern>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent'
          }
        }}
      />
    </BackgroundPattern>
  );
} 