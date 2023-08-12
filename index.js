import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import ThemeWrapper from './src/ThemeWrapper';

export default function Main() {
  return (
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  );
}

AppRegistry.registerComponent(appName, () => Main);