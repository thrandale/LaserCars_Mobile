import React, {useContext} from 'react';
import {NavigationHelpers} from '@react-navigation/native';
import HeaderButtons from '../components/HeaderButtons';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import GlowingButton from '../components/GlowingComponents/GlowingButton';
import {SettingsContext} from '../contexts/SettingsContext';

function Settings(props: {navigation: NavigationHelpers<any, any>}) {
  const settings = useContext(SettingsContext);
  const {dialog} = settings;

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },
    buttonsContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    button: {
      width: 200,
      textAlign: 'center',
      zIndex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <HeaderButtons navigation={props.navigation} hideBluetooth hideSettings />
      <Header>Settings</Header>
      <View style={styles.buttonsContainer}>
        <GlowingButton
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ColorSelection');
          }}>
          Car Color
        </GlowingButton>
        <GlowingButton
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ControlEditor');
          }}>
          Control Editor
        </GlowingButton>
        <GlowingButton
          style={styles.button}
          onPress={() => {
            dialog.Show(
              'Are you sure you want to reset all settings?',
              () => () => {
                settings.Reset();
              },
            );
          }}>
          Reset All
        </GlowingButton>
      </View>
    </View>
  );
}

export default Settings;
