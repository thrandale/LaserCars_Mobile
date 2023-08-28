import React, {useContext} from 'react';
import {Portal, Snackbar, useTheme} from 'react-native-paper';
import {SettingsContext} from '../contexts/SettingsContext';

function SnackBarManager() {
  const settings = useContext(SettingsContext);
  const theme = useTheme();

  function closeSnackBar() {
    settings.snackBar.visible.setValue(false);
  }

  return (
    <Portal>
      <Snackbar
        duration={5000}
        onIconPress={closeSnackBar}
        visible={settings.snackBar.visible.value}
        theme={{
          colors: {
            inverseSurface: theme.colors.secondary,
            inverseOnSurface: theme.colors.onSecondary,
          },
        }}
        onDismiss={closeSnackBar}>
        {settings.snackBar.message.value}
      </Snackbar>
    </Portal>
  );
}

export default SnackBarManager;
