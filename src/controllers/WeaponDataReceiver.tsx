/* eslint-disable no-bitwise */
import {useEffect} from 'react';
import BTController from './BTController';

function WeaponDataReceiver() {
  useEffect(() => {
    console.log('HitReceiver mounted');
    BTController.getInstance().monitorCharacteristic(
      BTController.WEAPONS_SERVICE,
      BTController.WEAPONS_INFO_CHARACTERISTIC,
      (data: number) => {
        const weapon = data & 0b11111;
        const changedSide = (data >> 5) & 0b111;
        console.log(`Weapon on side ${changedSide} changed to ${weapon}`);
      },
    );
  }, []);

  return null;
}

export default WeaponDataReceiver;
