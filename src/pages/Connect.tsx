import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Text, useTheme} from 'react-native-paper';
import {FlatList, StyleSheet, View} from 'react-native';
import {NavigationHelpers} from '@react-navigation/native';
import {Device} from 'react-native-ble-plx';
import {SettingsContext} from '../contexts/SettingsContext';
import HeaderButtons from '../components/HeaderButtons';
import BTController, {Zone} from '../controllers/BTController';
import GlowingButton from '../components/GlowingComponents/GlowingButton';
import Header from '../components/Header';

function Connect(props: {navigation: NavigationHelpers<any, any>}) {
  const settings = useContext(SettingsContext);
  const {snackBar} = settings;
  const {activeDevice} = settings.bt;
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);

  const scan = useCallback(async () => {
    setDevices([]);

    if (activeDevice.value) {
      setDevices([activeDevice.value]);
    }

    BTController.getInstance().scan(device => {
      setDevices(prevDevices =>
        prevDevices.find(d => d.id === device.id)
          ? prevDevices
          : [...prevDevices, device],
      );
    });
  }, [activeDevice]);

  const initBluetooth = useCallback(async () => {
    const poweredOn = await BTController.getInstance().init();
    if (!poweredOn) {
      console.log('Bluetooth is not powered on.');
      props.navigation.goBack();
    } else {
      console.log('Bluetooth is powered on.');
      scan();
    }
  }, [props.navigation, scan]);

  useEffect(() => {
    initBluetooth();

    return () => {
      BTController.getInstance().stopScan();
    };
  }, [initBluetooth]);

  async function connect(device: Device) {
    if (connectingTo !== null) {
      return;
    }
    setConnectingTo(device.id);
    BTController.getInstance()
      .connect(device)
      .then(() => {
        console.log(`Connected to ${device.name}.`);
        BTController.getInstance().monitorForDisconnect(device, () => {
          snackBar.Show(`Disconnected from ${device.name}.`);
          props.navigation.navigate('Connect');
        });
        props.navigation.goBack();

        setTimeout(() => {
          setInitialColor();
        }, 150);
      })
      .catch(() => {
        snackBar.Show(
          `There was a problem connecting to ${device.name}. Please try again.`,
        );
        snackBar.Show(
          'There was a problem connecting to the device. Please try again.',
        );
        setConnectingTo(null);
        restartScan();
      });
  }

  async function restartScan() {
    BTController.getInstance().stopScan();
    setDevices([]);
    scan();
  }

  function setInitialColor() {
    const {currentColor} = settings;
    if (currentColor.value !== '') {
      BTController.getInstance().sendSetColorCommand(
        Zone.FRONT,
        currentColor.value,
      );
      BTController.getInstance().sendSetColorCommand(
        Zone.MIDDLE,
        currentColor.value,
      );
      BTController.getInstance().sendSetColorCommand(
        Zone.BACK,
        currentColor.value,
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
    },
    grid: {
      padding: 20,
    },
    item: {
      width: 150,
    },
    scanningWrapper: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scanning: {
      fontSize: 25,
    },
  });

  return (
    <View style={styles.container}>
      <HeaderButtons
        hideBluetooth
        hideSettings
        showConnecting
        navigation={props.navigation}
      />
      <Header>Connect to Car</Header>
      {devices.length === 0 && (
        <View style={styles.scanningWrapper}>
          <Text style={styles.scanning}>Scanning...</Text>
        </View>
      )}
      {devices.length > 0 && (
        <FlatList
          data={devices}
          numColumns={4}
          horizontal={false}
          contentContainerStyle={styles.grid}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <GlowingButton
              onPress={() => connect(item)}
              margin={10}
              style={styles.item}>
              {item.name}
            </GlowingButton>
          )}
        />
      )}
    </View>
  );
}

export default Connect;
