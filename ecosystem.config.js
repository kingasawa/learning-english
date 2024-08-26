module.exports = {
  apps: [
    {
      name: 'expo-web-app',
      script: 'npm',
      args: 'run web',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
    },
  ],
};
