// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof MaterialIcon>['name']>) {
  return <MaterialIcon size={28} style={[{ marginBottom: -3 }, style]} { ...rest } />;
}
