import React, {useContext, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import {NavigationHelpers} from '@react-navigation/native';
import {
  SegmentedButtons,
  Modal,
  Portal,
  useTheme,
  Text,
  Switch,
} from 'react-native-paper';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import MultiTouchController from '../components/MultiTouchControls/MultiTouchController';
import {SettingsContext} from '../contexts/SettingsContext';
import GlowingButton from '../components/GlowingComponents/GlowingButton';
import {DrivingMode} from '../settings/DrivingModes';

function ControlEditor(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();
  const settings = useContext(SettingsContext);
  const {
    buttons1,
    buttons2,
    drivingMode,
    swapJoysticks,
    joystickDistance,
    Reset,
  } = settings.controlEditor;
  const {horizontalOffset} = settings.window;
  const [drivingModeVisible, setDrivingModeVisible] = useState(false);

  const radioButtons = Object.entries(DrivingMode).map(([key, value]) => {
    return {
      id: key,
      label: value,
      value: value,
      color: theme.colors.primary,
      size: 30,
      labelStyle: {
        color: theme.colors.onPrimary,
        fontFamily: theme.fonts.default.fontFamily,
      },
      containerStyle: {width: '100%', padding: 5},
    } as RadioButtonProps;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      backgroundColor: theme.colors.background,
      position: 'relative',
    },
    controllerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    segmentedButtonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      left: joystickDistance.value + horizontalOffset - 20,
      right: joystickDistance.value + horizontalOffset - 20,
      top: 50,
      bottom: 255,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      position: 'absolute',
      alignSelf: 'flex-end',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      padding: 10,
      paddingRight: 20,
    },
    drivingModeText: {
      fontSize: 16,
    },
    drivingModeButton: {
      width: 150,
      height: 50,
    },
    segmentedButtons: {
      width: 250,
    },
    modal: {
      alignSelf: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
      borderRadius: 25,
    },
    modalHeader: {
      fontSize: 24,
      color: theme.colors.primary,
      textAlign: 'center',
    },
    switchContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      gap: Platform.OS === 'ios' ? 10 : 5,
    },
  });

  return (
    <View style={styles.container}>
      <HeaderButtons hideBluetooth hideSettings navigation={props.navigation} />
      <View style={styles.controllerContainer}>
        <MultiTouchController editMode />
      </View>
      <View style={styles.segmentedButtonsContainer}>
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
      <Portal>
        <View style={styles.buttonContainer}>
          <Text style={styles.drivingModeText}>Mode: {drivingMode.value}</Text>
          <GlowingButton
            onPress={() => {
              setDrivingModeVisible(true);
            }}
            margin={10}>
            Change
          </GlowingButton>
          <GlowingButton
            onPress={() => {
              Reset();
            }}>
            Reset
          </GlowingButton>
        </View>
      </Portal>
      <Portal>
        <Modal
          visible={drivingModeVisible}
          onDismiss={() => {
            setDrivingModeVisible(false);
          }}
          contentContainerStyle={styles.modal}>
          <Text style={styles.modalHeader}>Driving Mode</Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={v => {
              drivingMode.setValue(v as DrivingMode);
            }}
            selectedId={drivingMode.value}
          />
          <View
            style={styles.switchContainer}
            onTouchStart={() => {
              if (Platform.OS === 'android') {
                swapJoysticks.setValue(!swapJoysticks.value);
              }
            }}>
            <Switch
              value={swapJoysticks.value}
              onValueChange={v => {
                swapJoysticks.setValue(v);
              }}
            />
            <Text>Swap Joysticks</Text>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

export default ControlEditor;
