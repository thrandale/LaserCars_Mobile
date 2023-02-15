import React, {useState, useEffect} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {Button, Text, TextInput} from 'react-native-paper';

const manager = new BleManager();
const serviceUUID = 'FFE0';
const characteristicUUID = 'FFE1';

export default function BLE(): JSX.Element {
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        console.log('BLE powered on');
        manager.connectedDevices([serviceUUID]).then(devices => {
          if (devices.length > 0) {
            devices.forEach(device => {
              console.log('Connecting to existing device...');
              device.connect().then(d => {
                console.log('Connected to ' + d.name);
                setActiveDevice(d);
                return device.discoverAllServicesAndCharacteristics();
              });
            });
          } else {
            scanAndConnect();
          }
        });
      }
    }, true);
    return () => subscription.remove();
  }, []);

  function scanAndConnect() {
    console.log('Scanning...');
    manager.startDeviceScan([serviceUUID], null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device && device.name === 'HMSoft') {
        console.log('Found HMSoft');
        manager.stopDeviceScan();
        device
          .connect()
          .then(d => {
            console.log('Connected to HMSoft');
            setActiveDevice(d);
            return device.discoverAllServicesAndCharacteristics();
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  }

  function send() {
    Keyboard.dismiss();
    if (activeDevice) {
      let messageToSend = message ? message : 'Hello World!';
      let encodedMessage = encode(messageToSend + '\0');
      manager
        .writeCharacteristicWithoutResponseForDevice(
          activeDevice.id,
          serviceUUID,
          characteristicUUID,
          encodedMessage,
        )
        .then(() => {
          console.log('Sent: ' + messageToSend);
          setMessage('');
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  return (
    <View style={styles.sendContainer}>
      <Text variant="titleLarge">Send Message to: {activeDevice?.name}</Text>
      <TextInput
        label="Message"
        value={message}
        onChangeText={setMessage}
        mode="outlined"
        onSubmitEditing={send}
        accessibilityLabel={undefined}
      />
      <Button mode="contained" onPress={send}>
        Send
      </Button>
      {/* <Button mode="contained" onPress={scanAndConnect}>
        Scan and Connect
      </Button> */}
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
