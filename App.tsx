import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen, SplashScreen } from './src/screens';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SafeAreaProvider>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <HomeScreen />
      )}
    </SafeAreaProvider>
  );
}

export default App;
