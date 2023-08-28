import React, {useContext} from 'react';
import {Portal, Dialog, Text, Button, useTheme} from 'react-native-paper';
import {SettingsContext} from '../contexts/SettingsContext';
import {StyleSheet} from 'react-native';

function SnackBarManager() {
  const {dialog} = useContext(SettingsContext);
  const theme = useTheme();

  function closeDialog() {
    dialog.visible.setValue(false);
  }

  function action() {
    dialog.action.value();
    closeDialog();
  }

  const buttonTheme = {
    colors: {
      primary: theme.colors.onPrimary,
    },
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 18,
    },
    dialog: {
      width: '50%',
      alignSelf: 'center',
    },
    actions: {
      marginBottom: -10,
    },
  });

  return (
    <Portal>
      <Dialog
        visible={dialog.visible.value}
        onDismiss={closeDialog}
        theme={{colors: {elevation: {level3: theme.colors.secondary}}}}
        style={styles.dialog}>
        <Dialog.Content>
          <Text style={styles.text}>{dialog.message.value}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={closeDialog} theme={buttonTheme}>
            Cancel
          </Button>
          <Button onPress={action} theme={buttonTheme}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default SnackBarManager;
