import React, { useCallback, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/features/splash';
import { AppNavigator } from './src/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  // Stable reference — prevents SplashScreen useEffect from re-firing on every render
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <AppNavigator />
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
