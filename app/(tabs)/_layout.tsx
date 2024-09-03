import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme } from "@tamagui/core";

export default function TabLayout() {

  const theme = useTheme();
  const primaryColor = theme.primary as string;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'About',
          headerShown: true,
          // tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='info' color={focused ? primaryColor : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Learn',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='school' color={focused ? primaryColor : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: 'Device',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='settings' color={focused ? primaryColor : color} />
          ),
        }}
      />
    </Tabs>
  );
}
