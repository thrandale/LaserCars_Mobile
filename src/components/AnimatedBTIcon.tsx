/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SvgXml} from 'react-native-svg';

function AnimatedBTIcon() {
  const theme = useTheme();
  const [bt1Xml, setBt1Xml] = useState<string>(`
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
      fill="#000">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
          d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
    </svg>`);

  const [bt2Xml, setBt2Xml] = useState<string>(`
    <svg viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16.24 12.01 L 18.56 14.33 C 18.84 13.61 19 12.82 19 12 C 19 11.18 18.84 10.41 18.57 9.69 L 16.24 12.01 Z M 17.71 7.71 L 12 2 L 11 2 L 11 9.59 L 6.41 5 L 5 6.41 L 10.59 12 L 5 17.59 L 6.41 19 L 11 14.41 L 11 22 L 12 22 L 17.71 16.29 L 13.41 12 L 17.71 7.71 Z M 13 5.83 L 14.88 7.71 L 13 9.59 L 13 5.83 Z M 14.88 16.29 L 13 18.17 L 13 14.41 L 14.88 16.29 Z M 7.873 12 L 5.553 14.32 C 5.273 13.6 5.113 12.81 5.113 11.99 C 5.113 11.17 5.273 10.4 5.543 9.68 L 7.873 12 Z"/>
    </svg>`);

  const [bt3Xml, setBt3Xml] = useState<string>(`
    <svg viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16.271 12.01 L 18.591 14.33 C 18.871 13.61 19.031 12.82 19.031 12 C 19.031 11.18 18.871 10.41 18.601 9.69 L 16.271 12.01 Z M 21.561 6.71 L 20.301 7.97 C 20.931 9.18 21.281 10.54 21.281 11.99 C 21.281 13.44 20.921 14.81 20.301 16.01 L 21.501 17.21 C 22.471 15.67 23.041 13.85 23.041 11.9 C 23.031 10.01 22.491 8.23 21.561 6.71 Z M 17.741 7.71 L 12.031 2 L 11.031 2 L 11.031 9.59 L 6.441 5 L 5.031 6.41 L 10.621 12 L 5.031 17.59 L 6.441 19 L 11.031 14.41 L 11.031 22 L 12.031 22 L 17.741 16.29 L 13.441 12 L 17.741 7.71 Z M 13.031 5.83 L 14.911 7.71 L 13.031 9.59 L 13.031 5.83 Z M 14.911 16.29 L 13.031 18.17 L 13.031 14.41 L 14.911 16.29 Z M 7.73 12.05 L 5.41 14.37 C 5.13 13.65 4.97 12.86 4.97 12.04 C 4.97 11.22 5.13 10.45 5.4 9.73 L 7.73 12.05 Z M 2.44 6.75 L 3.7 8.01 C 3.07 9.22 2.72 10.58 2.72 12.03 C 2.72 13.48 3.08 14.85 3.7 16.05 L 2.5 17.25 C 1.53 15.71 0.96 13.89 0.96 11.94 C 0.97 10.05 1.51 8.27 2.44 6.75 Z"/>
    </svg>`);

  const [currentImage, setCurrentImage] = React.useState<number>(0);

  useEffect(() => {
    setBt1Xml(bt1Xml.replace('#000', theme.colors.primary));
    setBt2Xml(bt2Xml.replace('#000', theme.colors.primary));
    setBt3Xml(bt3Xml.replace('#000', theme.colors.primary));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <View style={{width: 50, height: 50}}>
      {currentImage === 0 && <SvgXml xml={bt1Xml} width="100%" height="100%" />}
      {currentImage === 1 && <SvgXml xml={bt2Xml} width="100%" height="100%" />}
      {currentImage === 2 && <SvgXml xml={bt3Xml} width="100%" height="100%" />}
    </View>
  );
}

export default AnimatedBTIcon;
