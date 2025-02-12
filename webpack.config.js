const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@react-native-async-storage/async-storage',
      ],
    },
  }, argv);

  // إضافة fallback لـ async-storage
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "async_storage": false,
    vm: require.resolve('vm-browserify'),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/"),
  };

  // إضافة alias
  config.resolve.alias = {
    ...config.resolve.alias,
    '@react-native-async-storage/async-storage': require.resolve('@react-native-async-storage/async-storage/lib/commonjs/index.js'),
  };

  // تحديث قواعد CSS
  config.module.rules = config.module.rules.map(rule => {
    if (rule.oneOf) {
      rule.oneOf.unshift({
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      });
    }
    return rule;
  });

  return config;
}; 