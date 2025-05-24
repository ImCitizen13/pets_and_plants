import { ExpoConfig } from "expo/config";
const version = process.env.MY_CUSTOM_PROJECT_VERSION;
const backgroundColor = "#FDEDC9";
const config: ExpoConfig = {
  name:
    process.env.APP_ENV === "development" ? '"pets_and_plants"' : "Pets&Plants",
  slug: "pets_and_plants",
  version: version,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "petsandplants",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    version: version,
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: {
      light: "./assets/icons/ios-light.png",
      dark: "./assets/icons/ios-dark.png",
      tinted: "./assets/icons/ios-tinted.png",
    },
    bundleIdentifier:
      process.env.APP_ENV === "development"
        ? "com.meltohamy.pets-and-plants-dev"
        : "com.meltohamy.pets-and-plants",
  },
  android: {
    version: version,
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      monochromeImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: backgroundColor,
    },
    edgeToEdgeEnabled: true,
    package:
      process.env.APP_ENV === "development"
        ? "com.meltohamy.petandplantsdev"
        : "com.meltohamy.petsandplants",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon-light.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: backgroundColor,
      },
    ],
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "7be4b28e-e2dd-4414-ad26-fe3fe985f831",
    },
  },
  owner: "meltohamy",
  updates: {
    url: "https://u.expo.dev/7be4b28e-e2dd-4414-ad26-fe3fe985f831",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};

export default config;
