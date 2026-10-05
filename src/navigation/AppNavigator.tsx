import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Home, Search, User } from 'lucide-react-native';
import { useAppStore } from '../core/store';
import { ComicReaderScreen } from '../features/comic-reader';
import { HomeScreen } from '../features/home';
import { ProfileScreen } from '../features/profile';
import { SearchScreen } from '../features/search';
import { StoryDetailScreen } from '../features/story-detail';
import { colors } from '../theme';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.surfaceDark,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarActiveTintColor: colors.accentGold,
  tabBarInactiveTintColor: colors.textSecondaryDark,
};

export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      {/* <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => <Search size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      /> */}
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const selectedStoryId = useAppStore((state) => state.selectedStoryId);
  const selectedChapterId = useAppStore((state) => state.selectedChapterId);

  // 1. Active Comic Reader (Fullscreen immersive)
  if (selectedChapterId) {
    return <ComicReaderScreen chapterId={selectedChapterId} />;
  }

  // 2. Story Detail & Chapter Listing
  if (selectedStoryId) {
    return <StoryDetailScreen storyId={selectedStoryId} />;
  }

  // 3. Main Bottom Tab Discovery Feed
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}
