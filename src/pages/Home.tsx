import React, {useContext} from 'react';
import {TextInput} from 'react-native-paper';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {NavigationHelpers} from '@react-navigation/native';
import GlowingButton from '../components/GlowingComponents/GlowingButton';
import HeaderButtons from '../components/HeaderButtons';
import Header from '../components/Header';
import {SettingsContext} from '../contexts/SettingsContext';

function Home(props: {navigation: NavigationHelpers<any, any>}) {
  const {connected} = useContext(SettingsContext).bt;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
    },
    keyboardAvoidingView: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    input: {
      width: 200,
      textAlign: 'center',
      zIndex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={-50}
        style={[styles.keyboardAvoidingView]}>
        <HeaderButtons hideBack navigation={props.navigation} />
        <Header>Photon Fighters</Header>
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Lobby Code"
          disableFullscreenUI
          maxLength={8}
          autoCorrect={false}
        />
        <GlowingButton style={styles.input} onPress={() => {}}>
          Join Lobby
        </GlowingButton>
        <GlowingButton style={styles.input} onPress={() => {}}>
          Create Lobby
        </GlowingButton>
        <GlowingButton
          style={styles.input}
          disabled={!connected.value}
          onPress={() => {
            props.navigation.navigate('Drive');
          }}>
          Drive
        </GlowingButton>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Home;
