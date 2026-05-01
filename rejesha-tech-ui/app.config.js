import 'dotenv/config';

export default {
  "expo": {
    "scheme": "rejesha-tech",
    "name": "REJESHA TECH KE",
    "slug": "rejesha-tech",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/img/rejesha-tech-logo.png",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": false,
    "splash": {
      "image": "./assets/img/rejesha-tech-splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/img/alt-rejesha-tech-logo.png",
        "backgroundColor": "#ffffff"
      },
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      "edgeToEdgeEnabled": true,
      "softwareKeyboardLayoutMode": "resize",
      "package": "com.kenyanminato.rejeshatech"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "extra": {
      "router": {
        origin: false,
      },
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      "eas": {
        "projectId": "73fd464e-6479-4469-bced-75edcc94a280"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/73fd464e-6479-4469-bced-75edcc94a280"
    }
  }
};
