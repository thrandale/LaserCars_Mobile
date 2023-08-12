import React from 'react';
import {StyleSheet, View} from 'react-native';
import GlowingIconButton from '../components/GlowingComponents/GlowingIconButton';
import {NavigationHelpers} from '@react-navigation/native';

function HeaderButtons(props: {
  hideBack?: boolean;
  hideBluetooth?: boolean;
  hideSettings?: boolean;
  navigation: NavigationHelpers<any, any>;
}) {
  const styles = StyleSheet.create({
    settingButtonsContainer: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      top: 0,
      left: 0,
      padding: 15,
      justifyContent: 'space-between',
      zIndex: 1,
    },
    startIcons: {
      display: 'flex',
      flexDirection: 'row',
      gap: 15,
    },
    endIcons: {
      display: 'flex',
      flexDirection: 'row',
      gap: 15,
    },
  });

  return (
    <View style={styles.settingButtonsContainer}>
      <View style={styles.startIcons}>
        {!props.hideBack && (
          <GlowingIconButton
            icon="arrow-left"
            onPress={() => {
              props.navigation.goBack();
            }}
          />
        )}
      </View>
      <View style={styles.endIcons}>
        {!props.hideBluetooth && (
          <GlowingIconButton
            icon="bluetooth"
            onPress={() => {
              props.navigation.navigate('Connect');
            }}
          />
        )}
        {!props.hideSettings && (
          <GlowingIconButton icon="cog" onPress={() => {}} />
        )}
      </View>
    </View>
  );
}

export default HeaderButtons;
