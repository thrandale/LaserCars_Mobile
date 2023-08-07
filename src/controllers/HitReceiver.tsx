/* eslint-disable no-bitwise */
import {useEffect} from 'react';
import {Vibration} from 'react-native';
import BTController, {Animation} from './BTController';

function HitReceiver() {
  useEffect(() => {
    console.log('HitReceiver mounted');
    BTController.getInstance().monitorCharacteristic(
      BTController.WEAPONS_SERVICE,
      BTController.HIT_CHARACTERISTIC,
      (data: number) => {
        const fireSide = data & 0b111;
        const carId = (data >> 3) & 0b11111;
        const hitSide = (data >> 8) & 0b111;

        console.log(`Hit by ${carId} on side ${hitSide} with ${fireSide}`);
        Vibration.vibrate(500);
        BTController.getInstance().sendPlayAnimCommand(Animation.HIT);
      },
    );
  }, []);

  return null;
}

export default HitReceiver;
