import React, {useState, useEffect, useCallback} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {decode, encode} from 'base-64';
import {Button, Text, TextInput} from 'react-native-paper';

const manager = new BleManager();
const serviceUUID = '00000000-6a5c-4ebb-8da6-a4471e0965ef';
const characteristic1 = '00000001-6a5c-4ebb-8da6-a4471e0965ef';
const characteristic2 = '00000002-6a5c-4ebb-8da6-a4471e0965ef';

const deviceName = 'Laser Car';

export default function BLE(): JSX.Element {
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [message, setMessage] = useState<string>('');
  const [valueReceived, setValueReceived] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Discovers services and characteristics
  const discover = useCallback(async (d: Device) => {
    console.log('Discovering services and characteristics...');
    const device = await d.discoverAllServicesAndCharacteristics();
    setActiveDevice(device);
    setIsConnected(true);
    console.log('Discovered services and characteristics');
  }, []);

  // Scans for the device and connects to it
  const scanAndConnect = useCallback(async () => {
    console.log('Scanning...');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device && device.name === deviceName) {
        console.log(`Found ${deviceName}`);
        manager.stopDeviceScan();
        device
          .connect()
          .then(d => {
            console.log(`Connected to ${deviceName}`);
            discover(d);
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  }, [discover]);

  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        console.log('BLE powered on');
        // check for existing connections
        manager.connectedDevices([serviceUUID]).then(devices => {
          if (devices.length > 0) {
            devices.forEach(device => {
              console.log('Connecting to existing device...');
              device.connect().then(d => {
                console.log('Connected to ' + d.name);
                discover(d);
              });
            });
          } else {
            // otherwise scan and connect
            scanAndConnect();
          }
        });
      }
    }, true);
    return () => subscription.remove();
  }, [discover, scanAndConnect]);

  // Send a message to the device
  const send = (char: number) => {
    Keyboard.dismiss();
    if (activeDevice) {
      const characteristic = char === 1 ? characteristic1 : characteristic2;
      const messageToSend = message ? message : 'Hello World!';
      const encodedMessage = encode(messageToSend + '\0');
      manager
        .writeCharacteristicWithoutResponseForDevice(
          activeDevice.id,
          serviceUUID,
          characteristic,
          encodedMessage,
        )
        .then(() => {
          console.log('Sent: ' + messageToSend + ' to characteristic ' + char);
          setMessage('');
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    // monitor for changes to the characteristic
    if (!isConnected || !activeDevice) {
      return;
    }

    manager.monitorCharacteristicForDevice(
      activeDevice.id,
      serviceUUID,
      characteristic1,
      (error, characteristic) => {
        if (error) {
          console.log(error);
          return;
        }
        if (characteristic && characteristic.value) {
          let decodedValue = decode(characteristic.value);
          setValueReceived(decodedValue);
        }
      },
    );
  }, [isConnected, activeDevice]);

  return (
    <View style={styles.sendContainer}>
      <Text variant="titleLarge">Connected To: {activeDevice?.name}</Text>
      <TextInput
        label="Message"
        value={message}
        onChangeText={setMessage}
        mode="outlined"
        onSubmitEditing={() => send(1)}
        accessibilityLabel={undefined}
      />
      <Button mode="contained" onPress={() => send(1)} disabled={!activeDevice}>
        Send to 1
      </Button>
      <Button mode="contained" onPress={() => send(2)} disabled={!activeDevice}>
        Send to 2
      </Button>
      <Text variant="titleLarge">Char 1 value: {valueReceived}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sendContainer: {
    padding: 30,
    paddingBottom: 150,
    display: 'flex',
    width: '100%',
    height: '100%',
    gap: 20,
    justifyContent: 'center',
  },
});
