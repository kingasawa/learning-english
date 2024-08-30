import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#364684FF',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'About',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='info' color={focused ? '#364684FF' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Learn',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='school' color={focused ? '#364684FF' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: 'Device',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='settings' color={focused ? '#364684FF' : color} />
          ),
        }}
      />
    </Tabs>
  );
}
