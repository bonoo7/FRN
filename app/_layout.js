import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Suspense } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import ErrorBoundary from '../contexts/ErrorBoundary';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#4A6FFF" />
  </View>
);

const StackNavigator = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />
  );
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false
          }}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}