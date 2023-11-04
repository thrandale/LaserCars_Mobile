import React from 'react';
import ColorPicker from '../components/ColorPicker';
import {StyleSheet, View} from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import {NavigationHelpers} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import BTController, {Zone} from '../controllers/BTController';

function ColorSelection(props: {navigation: NavigationHelpers<any, any>}) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <HeaderButtons hideBluetooth hideSettings navigation={props.navigation} />
      <ColorPicker
        onColorChange={color => {
          BTController.getInstance().sendSetColorCommand(Zone.FRONT, color);
          BTController.getInstance().sendSetColorCommand(Zone.MIDDLE, color);
          BTController.getInstance().sendSetColorCommand(Zone.BACK, color);
        }}
      />
    </View>
  );
}

export default ColorSelection;
