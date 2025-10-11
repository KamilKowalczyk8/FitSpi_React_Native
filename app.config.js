import path from 'path';
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');

export default {
  expo: {
    name: "FitSpiReact",
    slug: "fitspireact",
    version: "1.0.0", 

    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],

    plugins: [
      [
        "expo-router",
        {
          root: "app",
        },
      ],
    ],
  },
};