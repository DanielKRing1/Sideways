module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    // Includes only react-native-paper modules that are used
    'react-native-paper/babel',
  ],
};
