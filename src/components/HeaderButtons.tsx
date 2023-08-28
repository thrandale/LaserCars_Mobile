import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import GlowingIconButton from '../components/GlowingComponents/GlowingIconButton';
import {NavigationHelpers} from '@react-navigation/native';
import AnimatedBTIcon from './AnimatedBTIcon';
import BTController from '../controllers/BTController';
import {SettingsContext} from '../contexts/SettingsContext';

function HeaderButtons(props: {
  hideBack?: boolean;
  hideBluetooth?: boolean;
  hideSettings?: boolean;
  showConnecting?: boolean;
  navigation: NavigationHelpers<any, any>;
}) {
  const settings = useContext(SettingsContext);

  function disconnect() {
    BTController.getInstance().disconnect();
  }

  async function bluetoothOnClick() {
    const valid = await BTController.getInstance().init();
    if (valid) {
      if (settings.bt.connected.value) {
        settings.dialog.Show(
          `Are you sure you want to disconnect from ${settings.bt.activeDevice.value?.name}?`,
          () => disconnect,
        );
      } else {
        props.navigation.navigate('Connect');
      }
    }
  }

  const styles = StyleSheet.create({
    settingButtonsContainer: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      top: 0,
      left: 0,
      padding: 20,
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
            icon={
              settings.bt.connected.value ? 'bluetooth-connect' : 'bluetooth'
            }
            onPress={bluetoothOnClick}
          />
        )}
        {!props.hideSettings && (
          <GlowingIconButton icon="cog" onPress={() => {}} />
        )}
        {props.showConnecting && <AnimatedBTIcon />}
      </View>
    </View>
  );
}

export default HeaderButtons;
