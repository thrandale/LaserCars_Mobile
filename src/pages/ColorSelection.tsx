import React from 'react';
import ColorPicker from '../components/ColorPicker';
import {StyleSheet, View} from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import {NavigationHelpers} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';

function ColorSelection(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return (
    <View style={styles.container}>
      <HeaderButtons hideBluetooth hideSettings navigation={props.navigation} />
      <ColorPicker
        onColorChange={() => {
          console.log('Color Changed');
        }}
      />
    </View>
  );
}

export default ColorSelection;
