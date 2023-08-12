/**
 * @format
 */

import React from 'react';
import {
  MD3DarkTheme,
  MD3Theme,
  Provider as PaperProvider,
} from 'react-native-paper';

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    primary: 'rgb(120, 69, 185)',
    onPrimary: 'rgb(228, 228, 228)',
    primaryContainer: 'rgb(127, 95, 168)',
    onPrimaryContainer: 'rgb(228, 228, 228)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(228, 228, 228)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(26, 28, 24)',
    onBackground: 'rgb(226, 227, 220)',
    surface: 'rgb(26, 28, 24)',
    onSurface: 'rgb(226, 227, 220)',
    outline: 'rgb(122, 117, 127)',
    shadow: 'rgb(0, 0, 0)',
    surfaceDisabled: 'rgba(226, 227, 220, 0.12)',
    onSurfaceDisabled: 'rgba(226, 227, 220, 0.38)',
    backdrop: 'rgba(44, 50, 41, 0.4)',
    tertiary: '',
    tertiaryContainer: '',
    onTertiary: '',
    onTertiaryContainer: '',
    secondary: '',
    secondaryContainer: '',
    onSecondary: '',
    onSecondaryContainer: '',
    outlineVariant: '',
    surfaceVariant: '',
    onSurfaceVariant: '',
    inverseSurface: '',
    inverseOnSurface: '',
    inversePrimary: '',
    scrim: '',
    elevation: {
      level0: '',
      level1: '',
      level2: '',
      level3: '',
      level4: '',
      level5: '',
    },
  },
};

const ThemeWrapper = (props: any) => {
  return <PaperProvider theme={darkTheme}>{props.children}</PaperProvider>;
};

export default ThemeWrapper;
