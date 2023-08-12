import React from 'react';
import {StyleSheet, View} from 'react-native';
import GlowingIconButton from '../components/GlowingComponents/GlowingIconButton';

function HeaderButtons(props: {
  hideBack?: boolean;
  hideBluetooth?: boolean;
  hideSettings?: boolean;
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
          <GlowingIconButton icon="arrow-left" onPress={() => {}} />
        )}
      </View>
      <View style={styles.endIcons}>
        {!props.hideBluetooth && (
          <GlowingIconButton icon="bluetooth" onPress={() => {}} />
        )}
        {!props.hideSettings && (
          <GlowingIconButton icon="cog" onPress={() => {}} />
        )}
      </View>
    </View>
  );
}

export default HeaderButtons;
