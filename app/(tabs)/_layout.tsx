import React from 'react';
import { useTheme } from "@tamagui/core";
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {

  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          opacity: 0.9
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lesson',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='add-moderator' color={focused ? primaryColor : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='school' color={focused ? primaryColor : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='account-circle' color={focused ? primaryColor : color} />
          ),
        }}
      />
    </Tabs>
  );
}
