import { config } from '@tamagui/config/v3';
import {createTamagui, createTokens} from "tamagui";

const customTokens = createTokens({
  ...config.tokens,
  color: {
    ...config.tokens.color,
    white: '#FFFFFF',
    black: '#000000',
    red: '#af0404',
    primary: '#3e94a9',
    secondary: '#67acbd',
    input: '#3e94a9'
  },
  // space: {
  //   ...config.tokens.space,
  //   small: 8,
  //   medium: 16,
  //   large: 32,
  // },
  // size: {
  //   ...config.tokens.size,
  //   small: 12,
  //   medium: 16,
  //   large: 20,
  // },
  // radius: {
  //   ...config.tokens.radius,
  //   small: 4,
  //   medium: 8,
  //   large: 16,
  // },
});

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: customTokens,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: customTokens.color.primary,
      color: customTokens.color.black,
    },
    dark: {
      ...config.themes.dark,
      background: customTokens.color.primary,
      color: customTokens.color.white,
    },
  },
});


export default tamaguiConfig
