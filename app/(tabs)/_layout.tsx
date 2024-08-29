import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'green',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='house' color={focused ? 'green' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Learning',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='school' color={focused ? 'green' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: 'Device',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='info' color={focused ? 'green' : color} />
          ),
        }}
      />
    </Tabs>
  );
}
