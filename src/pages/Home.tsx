import React, {useContext} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {SettingsContext} from '../contexts/SettingsContext';
import {NavigationHelpers} from '@react-navigation/native';
import GlowingButton from '../components/GlowingComponents/GlowingButton';
import GlowingIconButton from '../components/GlowingComponents/GlowingIconButton';
import HeaderButtons from '../components/HeaderButtons';

function Home(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      display: 'flex',
    },
    input: {
      width: 200,
    },
    title: {
      fontSize: 50,
      width: '100%',
      height: '20%',
      textAlign: 'center',
      color: theme.colors.primary,
      textShadowColor: theme.colors.shadow,
      textShadowRadius: 40,
      textShadowOffset: {width: 0, height: 0},
    },
    settingButtonsContainer: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      gap: 15,
      top: 15,
      right: 15,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photon Fighters</Text>
      <TextInput
        style={styles.input}
        mode="outlined"
        placeholder="Lobby Code"
      />
      <GlowingButton style={styles.input} onPress={() => {}}>
        Join Lobby
      </GlowingButton>
      <GlowingButton style={styles.input} onPress={() => {}}>
        Create Lobby
      </GlowingButton>
      <GlowingButton style={styles.input} onPress={() => {}}>
        Drive
      </GlowingButton>
      <HeaderButtons hideBack={true} />
    </View>
  );
}

export default Home;
