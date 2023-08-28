import React, {useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {ShadowedView} from 'react-native-fast-shadow';
import {Platform, StyleSheet} from 'react-native';

function GlowingComponent(props: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const [shadowRadius, setShadowRadius] = useState(10);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setShadowRadius(18);
    } else {
      setShadowRadius(8);
    }
  }, []);

  const styles = StyleSheet.create({
    shadow: {
      shadowOpacity: 1,
      shadowRadius: shadowRadius,
      shadowOffset: {width: 0, height: 0},
      borderRadius: 25,
      shadowColor: theme.colors.shadow,
      backgroundColor: theme.colors.shadow,
    },
  });

  return (
    <ShadowedView style={[props.style, styles.shadow]}>
      {props.children}
    </ShadowedView>
  );
}

export default GlowingComponent;
