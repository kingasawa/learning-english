import { config } from '@tamagui/config/v3';
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    myCustomTheme: {
      ...config.themes.light_green,
      background: '#f7f7f7',
      color: '#333',
      primary: '#6200ee',
      secondary: '#03dac6',
    }
  }
})

export default tamaguiConfig
