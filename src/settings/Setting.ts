import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import {Animated} from 'react-native';

const USE_LOCAL_STORAGE = true;

/**
 * A static setting is a setting that is not stored in local storage.
 * Should not be modified in runtime.
 */
export type StaticSetting<T> = T;

/**
 * A dynamic setting is a setting that is not stored in local storage.
 * Can be modified in runtime.
 */
export interface MutableSetting<T> {
  value: T;
  setValue: (newValue: T) => void;
}

/**
 * A stored setting is a setting that is stored in local storage.
 * Can be modified in runtime.
 */
export interface SavedSetting<T> extends MutableSetting<T> {
  reset: () => void;
}

/**
 * A setting that represents a component or a group of components.
 * Can be modified in runtime.
 * Stored in local storage.
 */
export interface ComponentsSetting {
  values: Map<string, Animated.ValueXY>;
  setComponent: (id: string, value: Animated.ValueXY) => void;
  reset: () => void;
}

/**
 * Returns a stateful value, and a function to update it.
 */
export const useSetting = <T>(initialValue: T): MutableSetting<T> => {
  const [value, setValue] = useState<T>(initialValue);

  const setSetting = (newValue: T) => {
    setValue(newValue);
  };

  return {
    value: value,
    setValue: setSetting,
  };
};

/**
 * Returns a stateful value, and a function to update it.
 * The value is stored in local storage.
 */
export const useSavedSetting = <T>(
  key: string,
  initialValue: T,
): SavedSetting<T> => {
  const [value, setValue] = useState<T>(initialValue);

  // Load setting from local storage
  useEffect(() => {
    if (!USE_LOCAL_STORAGE) {
      return;
    }
    const loadSetting = async () => {
      if (!USE_LOCAL_STORAGE) {
        return;
      }

      const item = await AsyncStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    };

    loadSetting();
  }, [key]);

  // Save setting to local storage
  useEffect(() => {
    if (!USE_LOCAL_STORAGE) {
      return;
    }

    const saveSetting = async () => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    };

    saveSetting();
  }, [key, value]);

  const setSetting = (newValue: T) => {
    setValue(newValue);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value: value,
    setValue: setSetting,
    reset,
  };
};

export const useComponentsSetting = (key: string): ComponentsSetting => {
  const savedSetting = useSavedSetting(key, JSON.stringify(new Map()));
  const [components, setComponents] = useState<Map<string, Animated.ValueXY>>(
    new Map(),
  );

  // Parse the saved setting
  useEffect(() => {
    const items = JSON.parse(savedSetting.value);
    if (Object.keys(items).length > 0) {
      setComponents(
        new Map(
          items.map((comp: [id: string, pos: {x: number; y: number}]) => [
            comp[0],
            new Animated.ValueXY(comp[1]),
          ]) as [string, Animated.ValueXY][],
        ),
      );
    }
  }, [key, savedSetting.value]);

  // Save setting to local storage
  useEffect(() => {
    savedSetting.setValue(JSON.stringify([...components]));
  }, [components, savedSetting]);

  const setComponent = (id: string, position: Animated.ValueXY) => {
    setComponents(new Map(components.set(id, position)));
  };

  const reset = () => {
    setComponents(new Map());
  };

  return {
    values: components,
    setComponent,
    reset,
  };
};

/**
 * Resets all settings in a settings group.
 */
export const resetSettings = (settings: any) => {
  Object.entries(settings).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (isSetting(value)) {
      console.log('resetting', key);
      value.reset();
    } else if (typeof value === 'object') {
      resetSettings(value);
    }
  });
};

const isSetting = <T>(item: any): item is SavedSetting<T> => {
  return typeof item === 'object' && 'reset' in item;
};
