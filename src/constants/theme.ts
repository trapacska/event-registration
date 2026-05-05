/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1F1A38',
    background: '#FFFFFF',
    backgroundElement: '#F4F2FB',
    backgroundSelected: '#E7E2F7',
    textSecondary: '#6E6695',
    primary: '#6457F9',
    accent: '#19D89F',
    border: '#DAD5EE',
    boardLight: '#ECE8FA',
    boardDark: '#6457F9',
    boardSelected: 'rgba(25,216,159,0.55)',
    boardLegal: 'rgba(25,216,159,0.30)',
  },
  dark: {
    text: '#F4F2FB',
    background: '#0E0B22',
    backgroundElement: '#1B1738',
    backgroundSelected: '#2A234F',
    textSecondary: '#9A93B8',
    primary: '#8C7FFF',
    accent: '#19D89F',
    border: '#2A234F',
    boardLight: '#1F1A38',
    boardDark: '#6457F9',
    boardSelected: 'rgba(25,216,159,0.55)',
    boardLegal: 'rgba(25,216,159,0.30)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
