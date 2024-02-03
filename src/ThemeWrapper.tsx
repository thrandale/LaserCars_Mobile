/**
 * @format
 */

import React from 'react';
import {
  MD3DarkTheme,
  MD3Theme,
  Provider as PaperProvider,
  configureFonts,
} from 'react-native-paper';

const fontConfig = {
  fontFamily: 'Tektur-Regular',
};

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
    shadow: 'rgb(145, 30, 194)',
    surfaceDisabled: 'rgba(120, 69, 185, 0.5)',
    onSurfaceDisabled: 'rgba(226, 227, 220, 0.38)',
    backdrop: 'rgba(44, 50, 41, 0.4)',
    tertiary: 'rgb(120, 69, 185)',
    tertiaryContainer: 'rgb(120, 69, 185)',
    onTertiary: 'rgb(120, 69, 185)',
    onTertiaryContainer: 'rgb(120, 69, 185)',
    secondary: 'rgb(62, 35, 95)',
    secondaryContainer: 'rgb(120, 69, 185)',
    onSecondary: 'rgb(228, 228, 228)',
    onSecondaryContainer: 'rgb(228, 228, 228)',
    outlineVariant: 'rgb(120, 69, 185)',
    surfaceVariant: 'rgb(120, 69, 185)',
    onSurfaceVariant: 'rgb(228, 228, 228)',
    inverseSurface: 'rgb(120, 69, 185)',
    inverseOnSurface: 'rgb(120, 69, 185)',
    inversePrimary: 'rgb(120, 69, 185)',
    scrim: 'rgb(120, 69, 185)',
    elevation: {
      level0: 'rgb(120, 69, 185)',
      level1: 'rgb(120, 69, 185)',
      level2: 'rgb(120, 69, 185)',
      level3: 'rgb(120, 69, 185)',
      level4: 'rgb(120, 69, 185)',
      level5: 'rgb(120, 69, 185)',
    },
  },
  fonts: configureFonts({config: fontConfig}),
};

function ThemeWrapper(props: any) {
  return <PaperProvider theme={darkTheme}>{props.children}</PaperProvider>;
}

export default ThemeWrapper;
