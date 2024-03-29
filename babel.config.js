module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Includes only react-native-paper modules that are used
    'react-native-paper/babel',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          ssComponents: './ssComponents',
          ssConstants: './ssConstants',
          ssContexts: './ssContexts',
          ssDatabase: './ssDatabase',
          ssHooks: './ssHooks',
          ssNavigation: './ssNavigation',
          ssRealm: './ssRealm',
          ssRedux: './ssRedux',
          ssScreens: './ssScreens',
          ssTheme: './ssTheme',
          ssUtils: './ssUtils',
        },
      },
    ],
  ],
};
