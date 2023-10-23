import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import {NavigationHelpers} from '@react-navigation/native';
import {SegmentedButtons, useTheme} from 'react-native-paper';
import MultiTouchController from '../components/MultiTouchControls/MultiTouchController';
import {SettingsContext} from '../contexts/SettingsContext';

function ControlEditor(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();
  const {buttons1, buttons2} = useContext(SettingsContext).controlEditor;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      padding: 50,
      paddingBottom: 255,
      backgroundColor: theme.colors.background,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    controllerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    segmentedButtons: {
      width: 250,
    },
  });
  return (
    <View style={styles.container}>
      <HeaderButtons hideBluetooth hideSettings navigation={props.navigation} />
      <View style={styles.controllerContainer}>
        <MultiTouchController editMode />
      </View>
      <SegmentedButtons
        style={styles.segmentedButtons}
        onValueChange={v => {
          buttons1.setValue(v);
        }}
        value={buttons1.value}
        buttons={[
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'},
          {value: '3', label: '3'},
        ]}
      />
      <SegmentedButtons
        style={styles.segmentedButtons}
        onValueChange={v => {
          buttons2.setValue(v);
        }}
        value={buttons2.value}
        buttons={[
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'},
          {value: '3', label: '3'},
        ]}
      />
    </View>
  );
}

export default ControlEditor;
