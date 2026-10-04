import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAppStore } from '../core/store';
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

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Search: '🔍',
    Profile: '👤',
  };
  return (
    <Text style={[tabIconStyles.icon, { opacity: focused ? 1 : 0.5 }]}>
      {icons[label]}
    </Text>
  );
}

const tabIconStyles = StyleSheet.create({
  icon: { fontSize: 20 },
});

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
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Search" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const selectedStoryId = useAppStore((state) => state.selectedStoryId);

  // When a story is selected, render StoryDetailScreen
  // its cleaner compared to my previous prop drill and pass state
  if (selectedStoryId) {
    return <StoryDetailScreen storyId={selectedStoryId} />;
  }

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}
