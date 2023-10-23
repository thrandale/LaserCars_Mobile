import React from 'react';
import {useTheme} from 'react-native-paper';
import {NavigationHelpers} from '@react-navigation/native';
import HeaderButtons from '../components/HeaderButtons';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import GlowingButton from '../components/GlowingComponents/GlowingButton';

function Settings(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      backgroundColor: theme.colors.background,
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
      </View>
    </View>
  );
}

export default Settings;
