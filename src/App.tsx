import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import SnackBarManager from './components/SnackBarManager';
import SettingsContextProvider from './contexts/SettingsContext';
import BTController from './controllers/BTController';
import Connect from './pages/Connect';
import Drive from './pages/Drive';
import Home from './pages/Home';
import Settings from './pages/Settings';
import ColorSelection from './pages/ColorSelection';
import ControlEditor from './pages/ControlEditor';
import DialogManager from './components/DialogManager';

function App(): JSX.Element {
  const theme = useTheme();
  const styles = StyleSheet.create({
    root: {
      backgroundColor: theme.colors.background,
      width: '100%',
      height: '100%',
    },
  });
  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SettingsContextProvider>
        <SnackBarManager />
        <DialogManager />
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
            <Stack.Screen name="ControlEditor" component={ControlEditor} />
            <Stack.Screen name="ColorSelection" component={ColorSelection} />
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
