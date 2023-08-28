import React, {createContext} from 'react';
import {Device} from 'react-native-ble-plx';
import {MD3Theme, useTheme} from 'react-native-paper';
import {
  ComponentsSetting,
  MutableSetting,
  StaticSetting,
  SavedSetting,
  resetSettings,
  useComponentsSetting,
  useSetting,
  useSavedSetting,
} from '../settings/Setting';
import {useWindow} from '../settings/Window';

interface BT {
  connected: MutableSetting<boolean>;
  activeDevice: MutableSetting<Device | null>;
}

interface Window {
  width: StaticSetting<number>;
  height: StaticSetting<number>;
  left: StaticSetting<number>;
  right: StaticSetting<number>;
  top: StaticSetting<number>;
  bottom: StaticSetting<number>;
}

interface Layout {
  gridSize: StaticSetting<number>;
  components: ComponentsSetting;
}

interface SnackBar {
  visible: MutableSetting<boolean>;
  message: MutableSetting<string>;
}

interface Dialog extends SnackBar {
  action: MutableSetting<() => void>;
}

export interface Settings {
  drivingMode: SavedSetting<string>;
  bt: BT;
  window: Window;
  layout: Layout;
  theme: MD3Theme;
  currentColor: SavedSetting<string>;
  snackBar: SnackBar;
  dialog: Dialog;
  reset: () => void;
}

export const SettingsContext = createContext<Settings>({} as Settings);

const SettingsContextProvider = (props: any) => {
  const reset = () => {
    resetSettings(settings);
  };

  const settings = {
    drivingMode: useSavedSetting<string>('drivingMode', 'mecanum'),
    bt: {
      connected: useSetting<boolean>(false),
      activeDevice: useSetting<Device | null>(null),
    },
    window: useWindow(),
    layout: {
      gridSize: 15,
      components: useComponentsSetting('components'),
    },
    theme: useTheme(),
    currentColor: useSavedSetting<string>('currentColor', '0000FF'),
    reset,
    snackBar: {
      visible: useSetting<boolean>(true),
      message: useSetting<string>('Snack bar message'),
    },
    dialog: {
      visible: useSetting<boolean>(false),
      message: useSetting<string>(''),
      action: useSetting<() => void>(() => {}),
    },
  };

  return (
    <SettingsContext.Provider value={settings}>
      {props.children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
