import React, {createContext} from 'react';
import {Device} from 'react-native-ble-plx';
import {MD3Theme, useTheme} from 'react-native-paper';
import {
  MutableSetting,
  StaticSetting,
  SavedSetting,
  resetSettings,
  useSetting,
  useSavedSetting,
} from '../settings/Setting';
import {useWindow} from '../settings/Window';
import {DrivingMode} from '../settings/DrivingModes';

interface BT {
  connected: MutableSetting<boolean>;
  activeDevice: MutableSetting<Device | null>;
}

interface Window {
  width: StaticSetting<number>;
  height: StaticSetting<number>;
  leftSA: StaticSetting<number>;
  rightSA: StaticSetting<number>;
  topSA: StaticSetting<number>;
  bottomSA: StaticSetting<number>;
  horizontalOffset: StaticSetting<number>;
  verticalOffset: StaticSetting<number>;
}

interface SnackBar {
  visible: MutableSetting<boolean>;
  message: MutableSetting<string>;
  Show: (message: string) => void;
}

interface Dialog extends Omit<SnackBar, 'Show'> {
  action: MutableSetting<() => void>;
  Show: (message: string, action: () => () => void) => void;
}

interface ControlEditor {
  drivingMode: SavedSetting<DrivingMode>;
  swapJoysticks: SavedSetting<boolean>;
  buttons1: SavedSetting<string>;
  buttons2: SavedSetting<string>;
  joystickDistance: SavedSetting<number>;
  minimumJoystickDistance: StaticSetting<number>;
  minimumJoystickGap: StaticSetting<number>;
  currentHandler: MutableSetting<number | null>;
  Reset: () => void;
}

export interface Settings {
  controlEditor: ControlEditor;
  bt: BT;
  window: Window;
  theme: MD3Theme;
  currentColor: SavedSetting<string>;
  snackBar: SnackBar;
  dialog: Dialog;
  background: {
    running: SavedSetting<boolean>;
  };
  Reset: () => void;
}

export const SettingsContext = createContext<Settings>({} as Settings);

const SettingsContextProvider = (props: any) => {
  const Reset = () => {
    resetSettings(settings);
  };

  const ShowSnackBar = (message: string) => {
    if (settings.snackBar.visible.value) {
      settings.snackBar.visible.setValue(false);
      setTimeout(() => {
        settings.snackBar.message.setValue(message);
        settings.snackBar.visible.setValue(true);
      }, 50);
    } else {
      settings.snackBar.message.setValue(message);
      settings.snackBar.visible.setValue(true);
    }
  };

  const ShowDialog = (message: string, action: () => void) => {
    settings.dialog.message.setValue(message);
    settings.dialog.action.setValue(action);
    settings.dialog.visible.setValue(true);
  };

  const settings = {
    controlEditor: {
      drivingMode: useSavedSetting<DrivingMode>(
        'drivingMode',
        DrivingMode.Mecanum,
      ),
      swapJoysticks: useSavedSetting<boolean>('swapJoysticks', false),
      buttons1: useSavedSetting<string>('buttons1', '2'),
      buttons2: useSavedSetting<string>('buttons2', '3'),
      joystickDistance: useSavedSetting<number>('joystickDistance', 30),
      minimumJoystickDistance: 10,
      minimumJoystickGap: 465,
      currentHandler: useSetting<number | null>(null),
      Reset,
    },
    bt: {
      connected: useSetting<boolean>(false),
      activeDevice: useSetting<Device | null>(null),
    },
    window: useWindow(),
    theme: useTheme(),
    currentColor: useSavedSetting<string>('currentColor', '0000FF'),
    Reset,
    snackBar: {
      visible: useSetting<boolean>(false),
      message: useSetting<string>(''),
      Show: ShowSnackBar,
    },
    dialog: {
      visible: useSetting<boolean>(false),
      message: useSetting<string>(''),
      action: useSetting<() => void>(() => {}),
      Show: ShowDialog,
    },
    background: {
      running: useSavedSetting<boolean>('backgroundRunning', true),
    },
  };

  return (
    <SettingsContext.Provider value={settings}>
      {props.children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
