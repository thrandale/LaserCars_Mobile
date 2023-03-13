import React from 'react';
import {BleManager, Device} from 'react-native-ble-plx';
import {encode} from 'base-64';

const manager = new BleManager();
const serviceUUID = '00000000-6a5c-4ebb-8da6-a4471e0965ef';
const characteristic1 = '00000001-6a5c-4ebb-8da6-a4471e0965ef';
const characteristic2 = '00000002-6a5c-4ebb-8da6-a4471e0965ef';

const deviceName = 'Laser Car';

class BLE extends React.Component {
  activeDevice: Device | null;
  isConnected: boolean;
  constructor() {
    super({});
    this.activeDevice = null;
    this.isConnected = false;
  }

  // Discovers services and characteristics
  discover = async (d: Device) => {
    console.log('Discovering services and characteristics...');
    const device = await d.discoverAllServicesAndCharacteristics();
    this.activeDevice = device;
    this.isConnected = true;
    console.log('Discovered services and characteristics');
  };

  // Scans for the device and connects to it
  scanAndConnect = async () => {
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
            this.discover(d);
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  };

  Init() {
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
                this.discover(d);
              });
            });
          } else {
            // otherwise scan and connect
            this.scanAndConnect();
          }
        });
      }
    }, true);
    return () => subscription.remove();
  }

  // Send a message to the device
  Send(data: string, char: number) {
    console.log(`Sending ${data} to characteristic ${char}`);
    if (this.activeDevice) {
      const characteristic = char === 1 ? characteristic1 : characteristic2;
      manager
        .writeCharacteristicWithoutResponseForDevice(
          this.activeDevice.id,
          serviceUUID,
          characteristic,
          encode(data),
        )
        .catch(e => {
          console.log(e);
        });
    }
  }

  public SendMecanum(angle: number, magnitude: number, rotation: number) {
    angle = Math.floor(angle * 100);
    magnitude = Math.floor(magnitude * 100);
    rotation = Math.floor(rotation * 100);

    if (angle === 0 && magnitude === 0 && rotation === 0) {
      this.Send('stop'.padEnd(14, '0'), 1);
      return;
    }

    const a: string = angle.toString().padStart(4, '0');
    const m: string = magnitude.toString().padStart(4, '0');
    const r: string = rotation.toString().padStart(4, '0');

    const message = `${a}:${m};${r}`;
    this.Send(message, 1);
  }

  public SendTank(magnitude: number, rotation: number) {
    magnitude = Math.floor(magnitude * 100);
    rotation = Math.floor(rotation * 100);

    if (magnitude === 0 && rotation === 0) {
      this.Send('stop', 2);
      return;
    }

    const message = `${magnitude}:${rotation}`;
    this.Send(message, 2);
  }
}

export default BLE;
