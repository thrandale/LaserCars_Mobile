import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './pages/Home';
import Connect from './pages/Connect';
import Drive from './pages/Drive';
import Settings from './pages/Settings';
import Lobby from './pages/Lobby';
import SettingsContextProvider from './contexts/SettingsContext';
import BTController from './components/BTController';
import LayoutEditor from './pages/LayoutEditor';
import ColorSelection from './pages/ColorSelection';

function App(): JSX.Element {
  const theme = useTheme();
  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      width: '100%',
      height: '100%',
    },
  });
  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <SettingsContextProvider>
          <BTController />
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animation: 'none',
                autoHideHomeIndicator: true,
              }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Connect" component={Connect} />
              <Stack.Screen name="Drive" component={Drive} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="LayoutEditor" component={LayoutEditor} />
              <Stack.Screen name="Lobby" component={Lobby} />
              <Stack.Screen name="ColorSelection" component={ColorSelection} />
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsContextProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
