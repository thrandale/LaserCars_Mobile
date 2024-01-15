module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    ['@babel/typescript', {allowDeclareFields: true}],
  ],
  plugins: ['react-native-reanimated/plugin'],
};
