import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device, Subscription} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {SettingsContext} from '../contexts/SettingsContext';
import {Buffer} from 'buffer';

const manager = new BleManager();

const deviceName = 'Laser Car';

export enum Zone {
  FRONT = 0,
  MIDDLE = 1,
  BACK = 2,
}

export enum Animation {
  HIT = 0,
  DEATH = 1,
}

class BTController extends React.Component {
  static contextType = SettingsContext;
  // const GAME_SERVICE = '00000000-6a5c-4ebb-8da6-a4471e0965ef';
  // const GAME_START_CHARACTERISTIC = '00000001-6a5c-4ebb-8da6-a4471e0965ef';
  // const GAME_END_CHARACTERISTIC = '00000002-6a5c-4ebb-8da6-a4471e0965ef';
  // const YOU_DIED_CHARACTERISTIC = '00000003-6a5c-4ebb-8da6-a4471e0965ef';
  static DRIVING_SERVICE = '10000000-6a5c-4ebb-8da6-a4471e0965ef';
  static DRIVING_CHARACTERISTIC = '10000001-6a5c-4ebb-8da6-a4471e0965ef';
  static WEAPONS_SERVICE = '20000000-6a5c-4ebb-8da6-a4471e0965ef';
  static WEAPONS_INFO_CHARACTERISTIC = '20000001-6a5c-4ebb-8da6-a4471e0965ef';
  static FIRE_CHARACTERISTIC = '20000002-6a5c-4ebb-8da6-a4471e0965ef';
  static HIT_CHARACTERISTIC = '20000003-6a5c-4ebb-8da6-a4471e0965ef';
  static LIGHTS_SERVICE = '30000000-6a5c-4ebb-8da6-a4471e0965ef';
  static SET_ZONE_COLOR_CHARACTERISTIC = '30000001-6a5c-4ebb-8da6-a4471e0965ef';
  static PLAY_ANIM_CHARACTERISTIC = '30000002-6a5c-4ebb-8da6-a4471e0965ef';

  declare context: React.ContextType<typeof SettingsContext>;

  private static instance: BTController;
  private disconnectListener: Subscription | null = null;

  constructor(props: {}) {
    super(props);

    if (BTController.instance) {
      return BTController.instance;
    }

    BTController.instance = this;
  }

  public static getInstance() {
    return BTController.instance;
  }

  public async init() {
    // ask for permissions on android
    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        if (
          !(
            result['android.permission.ACCESS_FINE_LOCATION'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.BLUETOOTH_SCAN'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.BLUETOOTH_CONNECT'] ===
              PermissionsAndroid.RESULTS.GRANTED
          )
        ) {
          this.context.snackBar.Show(
            'Permissions not granted. Please grant permissions and try again.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }

    const state = await manager.state();

    if (state === 'PoweredOn') {
      return true;
    } else {
      this.context.snackBar.Show(
        'Bluetooth is not powered on. Please turn on Bluetooth and try again.',
      );
      return false;
    }
  }

  public async scan(onDeviceFound: (device: Device) => void) {
    console.log('Scanning...');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device && device.name?.includes(deviceName)) {
        onDeviceFound(device);
      }
    });
  }

  public async connect(device: Device) {
    const {activeDevice, connected} = this.context.bt;

    console.log(`Connecting to ${device.name}...`);
    return new Promise((resolve, reject) => {
      device
        .connect({timeout: 2000})
        .then(d => {
          this.discover(d).then(() => {
            activeDevice.setValue(d);
            connected.setValue(true);
            resolve(undefined);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private async discover(device: Device) {
    const d = await device.discoverAllServicesAndCharacteristics();
    this.context.bt.activeDevice.setValue(d);
    console.log('Discovered services and characteristics');
  }

  public async monitorForDisconnect(device: Device, onDisconnect: () => void) {
    const {connected, activeDevice} = this.context.bt;
    this.disconnectListener = device.onDisconnected((error, d) => {
      console.log(`Disconnected from ${d.name}`);
      connected.setValue(false);
      activeDevice.setValue(null);
      this.disconnectListener?.remove();
      onDisconnect();
    });
  }

  public async disconnect() {
    const {connected, activeDevice} = this.context.bt;
    if (!activeDevice.value) {
      return;
    }

    console.log(`Disconnecting from ${activeDevice.value.name}...`);
    this.disconnectListener?.remove();
    return new Promise(resolve => {
      activeDevice.value!.cancelConnection().then(() => {
        console.log(`Disconnected from ${activeDevice.value!.name}`);
        connected.setValue(false);
        activeDevice.setValue(null);
        resolve(undefined);
      });
    });
  }

  public stopScan() {
    manager.stopDeviceScan();
    console.log('Stopped scanning');
  }

  public monitorCharacteristic(
    service: string,
    characteristic: string,
    onNotify: (data: number) => void,
  ) {
    if (!this.context.bt.activeDevice.value) {
      return;
    }
    console.log(`Monitoring ${characteristic}...`);
    manager.monitorCharacteristicForDevice(
      this.context.bt.activeDevice.value.id,
      service,
      characteristic,
      (error, char) => {
        if (error) {
          console.error(error);
          return;
        }
        if (char) {
          console.log(`Received ${char.value} from ${characteristic}`);
          const buffer = Buffer.from(char.value!, 'base64');
          const decoded = buffer.readUIntLE(0, buffer.byteLength);
          onNotify(decoded);
        }
      },
    );
  }

  public getConnectedDevices(): Promise<Device[]> {
    return manager.connectedDevices([BTController.DRIVING_SERVICE]);
  }

  // Send a message to the device
  private send(data: string, service: string, characteristic: string) {
    console.log(`Sending ${data} to characteristic ${characteristic}`);
    if (this.context.bt.activeDevice.value) {
      manager
        .writeCharacteristicWithoutResponseForDevice(
          this.context.bt.activeDevice.value.id,
          service,
          characteristic,
          encode(data),
        )
        .catch(e => {
          console.log(e);
        });
    }
  }

  public sendDriveCommand(angle: number, magnitude: number, rotation: number) {
    angle = Math.floor(angle * 100);
    magnitude = Math.floor(magnitude * 100);
    rotation = Math.floor(rotation * 100);

    if (angle === 0 && magnitude === 0 && rotation === 0) {
      this.send(
        'stop',
        BTController.DRIVING_SERVICE,
        BTController.DRIVING_CHARACTERISTIC,
      );
      return;
    }

    const message = `${angle}:${magnitude};${rotation}`;
    this.send(
      message,
      BTController.DRIVING_SERVICE,
      BTController.DRIVING_CHARACTERISTIC,
    );
  }

  public sendFireCommand(sides: number[]) {
    // eslint-disable-next-line no-bitwise
    const mask = sides.reduce((acc, side) => acc | (1 << side), 0);
    this.send(
      mask.toString(),
      BTController.WEAPONS_SERVICE,
      BTController.FIRE_CHARACTERISTIC,
    );
  }

  public sendSetColorCommand(zone: Zone, color: string) {
    const message = `${zone}${color}`;
    this.send(
      message,
      BTController.LIGHTS_SERVICE,
      BTController.SET_ZONE_COLOR_CHARACTERISTIC,
    );
  }

  public sendPlayAnimCommand(animation: Animation) {
    this.send(
      `${animation}`,
      BTController.LIGHTS_SERVICE,
      BTController.PLAY_ANIM_CHARACTERISTIC,
    );
  }

  render() {
    return null;
  }
}

export default BTController;
