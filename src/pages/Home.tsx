import React from 'react';
import {Text, TextInput} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {NavigationHelpers} from '@react-navigation/native';
import GlowingButton from '../components/GlowingComponents/GlowingButton';
import HeaderButtons from '../components/HeaderButtons';

function Home(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      backgroundColor: theme.colors.background,
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
    title: {
      width: '100%',
      height: '20%',
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: 50,
      textShadowColor: theme.colors.shadow,
      textShadowRadius: 30,
      textShadowOffset: {width: 0, height: 0},
    },
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={-50}
        style={[styles.keyboardAvoidingView]}>
        <HeaderButtons hideBack navigation={props.navigation} />
        <Text style={styles.title}>Photon Fighters</Text>
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
